// ============================================================================
// AEGIS ENDLESS - STATS & ATTRIBUTE ENGINE
// ============================================================================

import { RELICS } from './data.js';

export class StatsManager {
  constructor(state, achievementsManager, skillsManager) {
    this.state = state;
    this.achievements = achievementsManager;
    this.skills = skillsManager;
  }

  setManagers(achievementsManager, skillsManager) {
    this.achievements = achievementsManager;
    this.skills = skillsManager;
  }

  // Level Up requirement curve
  getXpForLevel(level) {
    return Math.floor(40 * Math.pow(1.22, level - 1) + (level * 15));
  }

  // Award XP and calculate any level-ups
  addXp(amount) {
    const xpBonus = this.getDerivedStats().xpBoost / 100;
    const finalXp = Math.floor(amount * (1 + xpBonus));
    this.state.hero.xp += finalXp;

    let leveledUp = false;
    while (this.state.hero.xp >= this.state.hero.xpToNext) {
      this.state.hero.xp -= this.state.hero.xpToNext;
      this.state.hero.level += 1;
      this.state.hero.unspentAp += 5; // 5 Stat Points per level
      this.state.hero.xpToNext = this.getXpForLevel(this.state.hero.level);
      leveledUp = true;
    }

    if (leveledUp && this.skills) {
      this.skills.sanitizeEquippedSkills();
    }

    return { finalXp, leveledUp };
  }

  // Allocate 1 or more points into an attribute
  allocateAttribute(attrName, amount = 1) {
    if (this.state.hero.unspentAp >= amount && this.state.hero.attributes[attrName] !== undefined) {
      this.state.hero.attributes[attrName] += amount;
      this.state.hero.unspentAp -= amount;
      if (this.skills) this.skills.sanitizeEquippedSkills();
      return true;
    }
    return false;
  }

  // 1-Click Free Respec: Refund all points allocated into attributes
  respecAttributes() {
    const attrs = this.state.hero.attributes;
    let totalPoints = 0;

    for (const key of Object.keys(attrs)) {
      totalPoints += attrs[key];
      attrs[key] = 0;
    }

    this.state.hero.unspentAp += totalPoints;
    if (this.skills) this.skills.sanitizeEquippedSkills();
    return totalPoints;
  }

  // Calculate Relic Bonuses
  getRelicBonuses() {
    const bonuses = {
      goldFind: 0,
      attackSpeedMult: 0,
      poisonDmgMult: 0,
      lifeSteal: 0,
      maxHpMult: 0,
      armor: 0
    };

    if (!this.state.relics) return bonuses;

    for (const relicDef of RELICS) {
      const rank = this.state.relics[relicDef.id] || 0;
      if (rank > 0) {
        const effect = relicDef.effect(rank);
        for (const [k, v] of Object.entries(effect)) {
          bonuses[k] = (bonuses[k] || 0) + v;
        }
      }
    }

    return bonuses;
  }

  // Calculate Equipment bonuses
  getEquipmentBonuses() {
    const bonuses = {
      atk: 0,
      aps: 0,
      hp: 0,
      armor: 0,
      block: 0,
      dodge: 0,
      poisonDmg: 0,
      poisonChance: 0,
      lifeSteal: 0,
      critChance: 0,
      critMult: 0,
      multiStrike: 0,
      thorns: 0,
      armorPen: 0,
      hpRegen: 0,
      goldFind: 0,
      xpBoost: 0
    };

    for (const slotKey of Object.values(this.state.equipment)) {
      if (!slotKey) continue;
      const item = slotKey;
      const enhanceMult = 1 + (item.level || 0) * 0.10; // +10% per enhance level

      if (item.baseAtk) bonuses.atk += Math.round(item.baseAtk * enhanceMult);
      if (item.baseAps) bonuses.aps += item.baseAps;
      if (item.baseHp) bonuses.hp += Math.round(item.baseHp * enhanceMult);
      if (item.baseArmor) bonuses.armor += Math.round(item.baseArmor * enhanceMult);
      if (item.baseBlock) bonuses.block += item.baseBlock;
      if (item.baseDodge) bonuses.dodge += item.baseDodge;

      // Affixes
      if (item.affixes && Array.isArray(item.affixes)) {
        for (const affix of item.affixes) {
          if (bonuses[affix.stat] !== undefined) {
            bonuses[affix.stat] += affix.val;
          }
        }
      }
    }

    return bonuses;
  }

  // Full Derived Combat Stats
  getDerivedStats() {
    const attrs = this.state.hero.attributes;
    const equip = this.getEquipmentBonuses();
    const relic = this.getRelicBonuses();
    const ach = this.achievements ? this.achievements.getAchievementBonuses() : {};

    // 1. Primary Attributes
    const str = attrs.str || 0;
    const dex = attrs.dex || 0;
    const agi = attrs.agi || 0;
    const int = attrs.int || 0;
    const vit = attrs.vit || 0;
    const end = attrs.end || 0;

    // Check Active Buffs
    const hasFlurry = this.skills ? this.skills.hasBuff('bladeFlurry') : false;
    const hasBloodFeast = this.skills ? this.skills.hasBuff('bloodFeast') : false;
    const hasBastion = this.skills ? this.skills.hasBuff('ironBastion') : false;

    // 2. Health & Defense
    const baseHp = 100 + (vit * 22) + (end * 8) + equip.hp;
    const totalHpMult = (relic.maxHpMult || 0) + (ach.maxHpMult || 0);
    const maxHp = Math.round(baseHp * (1 + totalHpMult));

    let armor = (str * 1.5) + (end * 3.5) + equip.armor + (relic.armor || 0);
    if (ach.armorMult) armor *= (1 + ach.armorMult);
    
    // DR Formula
    let dr = Math.min(80, (armor / (armor + 60 + ((this.state.stage || 1) * 4))) * 100);
    if (hasBastion) dr = Math.max(dr, 80);

    const dodge = Math.min(60, 2 + (agi * 0.45) + equip.dodge);
    const block = Math.min(75, (end * 0.35) + equip.block);
    let thorns = (end * 2.5) + equip.thorns;
    if (hasBastion) thorns *= 3.0; // Iron Bastion triples thorns

    // 3. Offense & Attack Speed
    const baseWeaponAps = equip.aps > 0 ? equip.aps : 1.0;
    const bonusAps = (dex * 0.025) + (agi * 0.015);
    let rawAps = (baseWeaponAps + bonusAps) * (1 + (relic.attackSpeedMult || 0));
    if (hasFlurry) rawAps *= 2.0; // Double attack speed during Flurry!
    const aps = Math.min(8.0, Math.max(0.6, rawAps));

    let rawAtk = 8 + (str * 3.2) + (dex * 0.8) + (int * 1.5) + equip.atk;
    if (ach.atkMult) rawAtk *= (1 + ach.atkMult);
    const atk = Math.round(rawAtk);

    const critChance = Math.min(100, 5 + (dex * 0.6) + equip.critChance);
    const critMult = 150 + (dex * 1.2) + (str * 0.5) + equip.critMult;
    let multiStrike = Math.min(100, (agi * 0.7) + equip.multiStrike);
    if (hasFlurry) multiStrike = 100; // 100% multi-strike during Flurry
    const armorPen = Math.min(75, (dex * 0.3) + equip.armorPen);

    // 4. Status Effects & DoTs
    const poisonScaling = (1 + (int * 0.04)) * (1 + (relic.poisonDmgMult || 0) + (ach.poisonDmgMult || 0));
    const basePoisonDmg = (int * 2.5) + equip.poisonDmg;
    const poisonDmg = Math.round(basePoisonDmg * poisonScaling);
    const poisonChance = Math.min(100, (int * 0.5) + (dex * 0.2) + equip.poisonChance);

    const bleed = (str * 0.4) + equip.bleed;

    // 5. Sustain & Economy
    let lifeSteal = Math.min(60, (str * 0.15) + (vit * 0.1) + equip.lifeSteal + (relic.lifeSteal || 0));
    if (hasBloodFeast) lifeSteal += 25; // +25% Lifesteal during Blood Feast
    const hpRegen = (vit * 1.2) + equip.hpRegen;

    const goldFind = (int * 0.5) + equip.goldFind + (relic.goldFind || 0) + (ach.goldFind || 0);
    const xpBoost = (int * 0.3) + (vit * 0.2) + equip.xpBoost + (ach.xpBoost || 0);
    const luck = (dex * 0.2) + (agi * 0.2) + (ach.luck || 0);

    // Estimate Total DPS
    const critBonusFactor = (critChance / 100) * ((critMult - 100) / 100);
    const multiBonusFactor = (multiStrike / 100);
    const hitDmgAvg = atk * (1 + critBonusFactor) * (1 + multiBonusFactor);
    const hitDps = hitDmgAvg * aps;
    const poisonDps = poisonChance > 0 ? (poisonDmg * (poisonChance / 100) * aps) : 0;
    const totalDps = Math.round(hitDps + poisonDps);

    return {
      maxHp,
      armor: Math.round(armor),
      dr: dr.toFixed(1),
      dodge: dodge.toFixed(1),
      block: block.toFixed(1),
      thorns: Math.round(thorns),
      atk,
      aps: aps.toFixed(2),
      critChance: critChance.toFixed(1),
      critMult: Math.round(critMult),
      multiStrike: multiStrike.toFixed(1),
      armorPen: armorPen.toFixed(1),
      poisonDmg,
      poisonChance: poisonChance.toFixed(1),
      bleed: bleed.toFixed(1),
      lifeSteal: lifeSteal.toFixed(1),
      hpRegen: hpRegen.toFixed(1),
      goldFind: Math.round(goldFind),
      xpBoost: Math.round(xpBoost),
      luck: Math.round(luck),
      totalDps
    };
  }

  // Archetype title helper based on stats
  getArchetypeTitle() {
    const attrs = this.state.hero.attributes;
    const highest = Object.entries(attrs).sort((a, b) => b[1] - a[1])[0];
    
    if (!highest || highest[1] < 5) return 'Novice Adventurer';

    switch (highest[0]) {
      case 'str': return attrs.vit > attrs.dex ? 'Blood Berserker' : 'Titan Warrior';
      case 'dex': return 'Shadow Assassin';
      case 'agi': return 'Wind Duelist';
      case 'int': return attrs.dex > 10 ? 'Toxic Viper' : 'Arcane Sage';
      case 'vit': return 'Undying Guardian';
      case 'end': return 'Iron Juggernaut';
      default: return 'Mercenary';
    }
  }
}
