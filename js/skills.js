// ============================================================================
// AEGIS ENDLESS - ACTIVE ATTACKS & SKILLS ENGINE (STAT-SCALED & LEVEL-TIED)
// ============================================================================

export const SKILL_SLOT_LEVELS = [
  { slot: 1, level: 1 },
  { slot: 2, level: 5 },
  { slot: 3, level: 15 },
  { slot: 4, level: 30 },
  { slot: 5, level: 50 }
];

function getSkillCoords(combatEngine) {
  const h = combatEngine && typeof combatEngine.getHeroCoords === 'function' ? combatEngine.getHeroCoords() : { x: 100, y: 110 };
  const e = combatEngine && typeof combatEngine.getEnemyCoords === 'function' ? combatEngine.getEnemyCoords() : { x: 300, y: 110 };
  return { hx: h.x, hy: h.y, ex: e.x, ey: e.y };
}

export const ACTIVE_SKILLS = [
  // 0. Universal Starter Attack
  {
    id: 'power_strike',
    name: 'Power Strike',
    category: 'Universal',
    sprite: { r: 5, c: 2 },
    req: {},
    cooldown: 8.0,
    duration: 0,
    desc: 'Deliver a focused physical blow dealing 220% Physical Damage.',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const dmg = Math.max(1, Math.floor(derived.attack * 2.2));
      enemy.currentHp -= dmg;
      combatEngine.sound.playSlash();
      combatEngine.ui.spawnDamageSplat(dmg, 'normal', 'enemy');
      combatEngine.ui.triggerHeroAttackVisual();
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnSlashArc(ex, ey, false, 45);
        combatEngine.particles.spawnSparks(ex, ey, '#fbbf24', 10, 1.2);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },

  // 1. Strength Skills (Physical Power & Armor Sunder)
  {
    id: 'colossus_strike',
    name: 'Colossus Strike',
    category: 'Strength',
    sprite: { r: 5, c: 0 },
    req: { str: 8 },
    cooldown: 11.0,
    duration: 0,
    desc: 'Slam with crushing might dealing 380% Damage with +40% Armor Penetration.',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const enemyArmor = Math.max(0, enemy.armor * (1 - ((parseFloat(derived.armorPen) + 40) / 100)));
      const dr = enemyArmor / (enemyArmor + 60);
      const dmg = Math.max(1, Math.floor(derived.attack * 3.8 * (1 - dr)));
      enemy.currentHp -= dmg;
      combatEngine.sound.playCrit();
      combatEngine.ui.spawnDamageSplat(dmg, 'crit', 'enemy');
      combatEngine.ui.triggerHeroAttackVisual();
      combatEngine.ui.triggerScreenShake('heavy');
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnShockwave(ex, ey, '#f59e0b', 45, 0.4);
        combatEngine.particles.spawnSparks(ex, ey, '#f97316', 16, 1.5);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },
  {
    id: 'titanic_sunder',
    name: 'Titanic Sunder',
    category: 'Strength',
    sprite: { r: 5, c: 4 },
    req: { str: 25, end: 10 },
    cooldown: 16.0,
    duration: 0,
    desc: 'Shatter defenses dealing 520% Damage and halving enemy Armor.',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      enemy.armor = Math.floor(enemy.armor * 0.5);
      const dmg = Math.max(1, Math.floor(derived.attack * 5.2));
      enemy.currentHp -= dmg;
      combatEngine.sound.playCrit();
      combatEngine.ui.spawnDamageSplat(`SUNDER ${dmg}!`, 'crit', 'enemy');
      combatEngine.ui.triggerHeroAttackVisual();
      combatEngine.ui.triggerScreenShake('heavy');
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnNovaWave(ex, ey, '#ef4444', 35);
        combatEngine.particles.spawnCritShards(ex, ey, 20);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },

  // 2. Dexterity Skills (Critical Precision & Assassination)
  {
    id: 'precision_thrust',
    name: 'Precision Thrust',
    category: 'Dexterity',
    sprite: { r: 5, c: 1 },
    req: { dex: 8 },
    cooldown: 10.0,
    duration: 0,
    desc: 'A lethal thrust with 100% guaranteed Critical Hit dealing 320% Crit Damage.',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const critMult = parseFloat(derived.critMult) / 100;
      const dmg = Math.max(1, Math.floor(derived.attack * 3.2 * critMult));
      enemy.currentHp -= dmg;
      combatEngine.sound.playCrit();
      combatEngine.ui.spawnDamageSplat(`CRIT ${dmg}!`, 'crit', 'enemy');
      combatEngine.ui.triggerHeroAttackVisual();
      combatEngine.ui.triggerScreenShake('crit');
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnSlashArc(ex, ey, true, -45);
        combatEngine.particles.spawnCritShards(ex, ey, 14);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },
  {
    id: 'assassinate',
    name: 'Assassinate',
    category: 'Dexterity',
    sprite: { r: 5, c: 6 },
    req: { dex: 25, agi: 10 },
    cooldown: 15.0,
    duration: 0,
    desc: 'Lethal execution dealing 600% Damage (Double damage if enemy HP < 40%).',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const isExecute = (enemy.currentHp / enemy.maxHp) <= 0.4;
      const mult = isExecute ? 12.0 : 6.0;
      const dmg = Math.max(1, Math.floor(derived.attack * mult));
      enemy.currentHp -= dmg;
      combatEngine.sound.playCrit();
      combatEngine.ui.spawnDamageSplat(isExecute ? `EXECUTE ${dmg}!` : `ASSASSIN ${dmg}!`, 'crit', 'enemy');
      combatEngine.ui.triggerHeroAttackVisual();
      combatEngine.ui.triggerScreenShake('heavy');
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnSlashArc(ex, ey, true, 30);
        combatEngine.particles.spawnSlashArc(ex, ey, true, -60);
        combatEngine.particles.spawnBloodSplatter(ex, ey, 16);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },

  // 3. Agility Skills (Attack Speed, Multi-Strike & Evasion)
  {
    id: 'blade_flurry',
    name: 'Blade Flurry',
    category: 'Agility',
    sprite: { r: 3, c: 4 },
    req: { agi: 8 },
    cooldown: 14.0,
    duration: 6.0,
    desc: 'Accelerates tempo granting +100% Attack Speed and +100% Multi-Strike for 6s.',
    buffKey: 'bladeFlurry',
    onCast: (combatEngine) => {
      combatEngine.sound.playCrit();
      combatEngine.ui.triggerHeroAttackVisual();
      combatEngine.ui.spawnDamageSplat('FLURRY!', 'crit', 'hero');
      const { hx, hy, ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnSlashArc(hx, hy, true, -30);
        combatEngine.particles.spawnSlashArc(ex, ey, true, 45);
        combatEngine.particles.spawnCritShards(hx, hy, 14);
      }
      combatEngine.ui.triggerScreenShake('hit');
    }
  },
  {
    id: 'cyclone_dance',
    name: 'Cyclone Dance',
    category: 'Agility',
    sprite: { r: 6, c: 2 },
    req: { agi: 25, dex: 10 },
    cooldown: 18.0,
    duration: 6.0,
    desc: 'Enter an evasive blade dance granting +150% APS and +40% Dodge for 6s.',
    buffKey: 'cycloneDance',
    onCast: (combatEngine) => {
      combatEngine.sound.playCrit();
      combatEngine.ui.triggerHeroAttackVisual();
      combatEngine.ui.spawnDamageSplat('CYCLONE!', 'dodge', 'hero');
      const { hx, hy } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnShockwave(hx, hy, '#38bdf8', 50, 0.4);
        combatEngine.particles.spawnSparks(hx, hy, '#7dd3fc', 18, 1.4);
      }
    }
  },

  // 4. Intelligence Skills (Poison, Acid & Status Explosion)
  {
    id: 'venom_nova',
    name: 'Venom Nova',
    category: 'Intelligence',
    sprite: { r: 0, c: 1 },
    req: { int: 8 },
    cooldown: 12.0,
    duration: 0,
    desc: 'Infuse enemy with +12 Poison Stacks and trigger a 280% nature burst.',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const poison = enemy.statusEffects.poison;
      poison.stacks = Math.min(50, poison.stacks + 12);
      poison.dmgPerStack = Math.max(poison.dmgPerStack, Math.floor(derived.poisonDmg / 2));
      poison.duration = 6.0;
      const burstDmg = Math.max(1, Math.floor(derived.poisonDmg * 2.8));
      enemy.currentHp -= burstDmg;
      combatEngine.ui.spawnDamageSplat(burstDmg, 'poison', 'enemy');
      combatEngine.ui.triggerPoisonVisual('enemy');
      combatEngine.sound.playPoisonTick();
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnNovaWave(ex, ey, '#10b981', 26);
        combatEngine.particles.spawnPoisonBubbles(ex, ey, 14);
      }
      combatEngine.ui.triggerScreenShake('crit');
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },
  {
    id: 'toxic_apocalypse',
    name: 'Toxic Apocalypse',
    category: 'Intelligence',
    sprite: { r: 0, c: 2 },
    req: { int: 25, str: 10 },
    cooldown: 16.0,
    duration: 0,
    desc: 'Detonates all active poison stacks for 500% amplified damage + 20 fresh stacks.',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const currentStacks = enemy.statusEffects.poison.stacks || 1;
      const boomDmg = Math.max(1, Math.floor(derived.poisonDmg * currentStacks * 2.5));
      enemy.currentHp -= boomDmg;
      enemy.statusEffects.poison.stacks = Math.min(60, currentStacks + 20);
      enemy.statusEffects.poison.duration = 8.0;
      combatEngine.sound.playCrit();
      combatEngine.ui.spawnDamageSplat(`APOCALYPSE ${boomDmg}!`, 'poison', 'enemy');
      combatEngine.ui.triggerScreenShake('heavy');
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnNovaWave(ex, ey, '#059669', 40);
        combatEngine.particles.spawnPoisonBubbles(ex, ey, 24);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },

  // 5. Vitality Skills (Blood Leech, Healing & Immortality)
  {
    id: 'blood_feast',
    name: 'Blood Feast',
    category: 'Vitality',
    sprite: { r: 1, c: 0 },
    req: { vit: 8 },
    cooldown: 16.0,
    duration: 6.0,
    desc: 'Restores 35% Max HP instantly and grants +30% Life Steal for 6s.',
    buffKey: 'bloodFeast',
    onCast: (combatEngine, statsManager) => {
      const derived = statsManager.getDerivedStats();
      const healAmount = Math.floor(derived.maxHp * 0.35);
      combatEngine.state.hero.currentHp = Math.min(derived.maxHp, combatEngine.state.hero.currentHp + healAmount);
      combatEngine.ui.triggerBleedVisual('hero');
      combatEngine.ui.spawnDamageSplat(`+${healAmount} HP`, 'heal', 'hero');
      combatEngine.sound.playCrit();
      const { hx, hy, ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnLifeLeech(ex, ey, hx, hy, 14);
        combatEngine.particles.spawnBloodSplatter(hx, hy, 8);
      }
      combatEngine.ui.triggerScreenShake('hit');
    }
  },
  {
    id: 'immortal_surge',
    name: 'Immortal Surge',
    category: 'Vitality',
    sprite: { r: 1, c: 4 },
    req: { vit: 25, end: 10 },
    cooldown: 22.0,
    duration: 8.0,
    desc: 'Restores 60% Max HP instantly and doubles HP Regeneration for 8s.',
    buffKey: 'immortalSurge',
    onCast: (combatEngine, statsManager) => {
      const derived = statsManager.getDerivedStats();
      const healAmount = Math.floor(derived.maxHp * 0.60);
      combatEngine.state.hero.currentHp = Math.min(derived.maxHp, combatEngine.state.hero.currentHp + healAmount);
      combatEngine.ui.spawnDamageSplat(`IMMORTAL +${healAmount} HP`, 'heal', 'hero');
      combatEngine.sound.playLevelUp();
      const { hx, hy } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnShockwave(hx, hy, '#10b981', 60, 0.4);
      }
    }
  },

  // 6. Endurance Skills (Iron Defense, Shield Slam & Aegis)
  {
    id: 'iron_bastion',
    name: 'Iron Bastion',
    category: 'Endurance',
    sprite: { r: 3, c: 7 },
    req: { end: 8 },
    cooldown: 18.0,
    duration: 5.0,
    desc: 'Locks Damage Reduction to 80% and triples Thorns reflect damage for 5s.',
    buffKey: 'ironBastion',
    onCast: (combatEngine) => {
      combatEngine.sound.playLevelUp();
      combatEngine.ui.spawnDamageSplat('BASTION!', 'dodge', 'hero');
      const { hx, hy } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnShieldBurst(hx, hy);
        combatEngine.particles.spawnShockwave(hx, hy, '#38bdf8', 55, 0.35);
      }
    }
  },
  {
    id: 'shield_slam',
    name: 'Shield Slam',
    category: 'Endurance',
    sprite: { r: 6, c: 0 },
    req: { end: 25, str: 10 },
    cooldown: 14.0,
    duration: 0,
    desc: 'Slam with your shield dealing 350% Armor value as unmitigated damage.',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const dmg = Math.max(1, Math.floor(derived.armor * 3.5));
      enemy.currentHp -= dmg;
      combatEngine.sound.playCrit();
      combatEngine.ui.spawnDamageSplat(`SLAM ${dmg}!`, 'dodge', 'enemy');
      combatEngine.ui.triggerScreenShake('heavy');
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnShieldBurst(ex, ey);
        combatEngine.particles.spawnShockwave(ex, ey, '#94a3b8', 50, 0.4);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  },

  // 7. Hybrid Mastery Skill
  {
    id: 'aegis_overload',
    name: 'Aegis Overload',
    category: 'Hybrid',
    sprite: { r: 5, c: 14 },
    req: { str: 25, int: 25 },
    cooldown: 20.0,
    duration: 6.0,
    desc: 'Overload divine aegis dealing 750% Damage and +50% Crit & +50% Multi-Strike for 6s.',
    buffKey: 'aegisOverload',
    onCast: (combatEngine, statsManager) => {
      const enemy = combatEngine.currentEnemy;
      if (!enemy || enemy.currentHp <= 0) return;
      const derived = statsManager.getDerivedStats();
      const dmg = Math.max(1, Math.floor(derived.attack * 7.5));
      enemy.currentHp -= dmg;
      combatEngine.sound.playLevelUp();
      combatEngine.ui.spawnDamageSplat(`OVERLOAD ${dmg}!`, 'crit', 'enemy');
      combatEngine.ui.triggerHeroAttackVisual();
      combatEngine.ui.triggerScreenShake('heavy');
      const { ex, ey } = getSkillCoords(combatEngine);
      if (combatEngine.particles) {
        combatEngine.particles.spawnNovaWave(ex, ey, '#c084fc', 45);
        combatEngine.particles.spawnCritShards(ex, ey, 24);
      }
      if (enemy.currentHp <= 0) combatEngine.onEnemyDefeated();
    }
  }
];

export class SkillsManager {
  constructor(state, combatEngine, statsManager, soundEngine, uiManager) {
    this.state = state;
    this.combat = combatEngine;
    this.stats = statsManager;
    this.sound = soundEngine;
    this.ui = uiManager;

    // Ensure skill state structure
    if (!this.state.skills) {
      this.state.skills = {
        cooldowns: {},
        activeBuffs: {},
        equippedSkills: ['power_strike'],
        autoCast: {
          power_strike: true,
          colossus_strike: true,
          titanic_sunder: true,
          precision_thrust: true,
          assassinate: true,
          blade_flurry: true,
          cyclone_dance: true,
          venom_nova: true,
          toxic_apocalypse: true,
          blood_feast: true,
          immortal_surge: true,
          iron_bastion: true,
          shield_slam: true,
          aegis_overload: true
        }
      };
    }

    if (!Array.isArray(this.state.skills.equippedSkills) || this.state.skills.equippedSkills.length === 0) {
      this.state.skills.equippedSkills = ['power_strike'];
    }

    this.sanitizeEquippedSkills();
  }

  // Number of unlocked skill slots based on Hero Level
  getMaxSlots() {
    const level = (this.state && this.state.hero && this.state.hero.level) || 1;
    let slots = 1;
    for (const entry of SKILL_SLOT_LEVELS) {
      if (level >= entry.level) {
        slots = entry.slot;
      }
    }
    return Math.min(5, slots);
  }

  // Check if a skill's attribute requirements are met by current hero stats
  isSkillUnlocked(skill) {
    if (!skill || !skill.req) return true;
    const attrs = (this.state && this.state.hero && this.state.hero.attributes) || {};
    for (const [attrKey, reqVal] of Object.entries(skill.req)) {
      if ((attrs[attrKey] || 0) < reqVal) {
        return false;
      }
    }
    return true;
  }

  // Return all currently unlocked skills based on stats
  getUnlockedSkills() {
    return ACTIVE_SKILLS.filter(skill => this.isSkillUnlocked(skill));
  }

  // Return currently equipped skills (up to max slots)
  getEquippedSkills() {
    this.sanitizeEquippedSkills();
    return this.state.skills.equippedSkills.map(id => ACTIVE_SKILLS.find(s => s.id === id)).filter(Boolean);
  }

  // Equip a skill into a specific slot index (0 to maxSlots - 1)
  equipSkill(skillId, slotIndex = 0) {
    const skill = ACTIVE_SKILLS.find(s => s.id === skillId);
    if (!skill || !this.isSkillUnlocked(skill)) return false;

    const maxSlots = this.getMaxSlots();
    if (slotIndex < 0 || slotIndex >= maxSlots) return false;

    // Remove if already in another slot
    const filtered = this.state.skills.equippedSkills.filter(id => id !== skillId);
    while (filtered.length <= slotIndex) {
      filtered.push(null);
    }
    filtered[slotIndex] = skillId;
    this.state.skills.equippedSkills = filtered.filter(Boolean).slice(0, maxSlots);

    if (this.state.skills.autoCast[skillId] === undefined) {
      this.state.skills.autoCast[skillId] = true;
    }

    return true;
  }

  // Unequip a skill slot
  unequipSkill(slotIndex) {
    if (this.state.skills.equippedSkills[slotIndex]) {
      this.state.skills.equippedSkills.splice(slotIndex, 1);
      if (this.state.skills.equippedSkills.length === 0) {
        this.state.skills.equippedSkills = ['power_strike'];
      }
      return true;
    }
    return false;
  }

  // Ensure equipped skills obey slot limits and stat requirements
  sanitizeEquippedSkills() {
    const maxSlots = this.getMaxSlots();
    let equipped = this.state.skills.equippedSkills || [];
    
    // Filter out skills whose stat requirements are no longer met
    equipped = equipped.filter(id => {
      const skill = ACTIVE_SKILLS.find(s => s.id === id);
      return skill && this.isSkillUnlocked(skill);
    });

    if (equipped.length === 0) {
      const unlocked = this.getUnlockedSkills();
      equipped = [unlocked[0]?.id || 'power_strike'];
    }

    this.state.skills.equippedSkills = equipped.slice(0, maxSlots);
  }

  tick(dt) {
    const skillsState = this.state.skills;
    const equipped = this.getEquippedSkills();

    // 1. Process Cooldowns for equipped skills
    for (const skill of equipped) {
      if (skillsState.cooldowns[skill.id] > 0) {
        skillsState.cooldowns[skill.id] -= dt;
        if (skillsState.cooldowns[skill.id] <= 0) {
          skillsState.cooldowns[skill.id] = 0;
        }
      }

      // Always auto-cast equipped attacks as soon as they are off cooldown
      if ((skillsState.cooldowns[skill.id] || 0) <= 0) {
        this.castSkill(skill.id);
      }
    }

    // 2. Process Active Buffs
    for (const [buffKey, duration] of Object.entries(skillsState.activeBuffs)) {
      if (duration > 0) {
        skillsState.activeBuffs[buffKey] -= dt;
        if (skillsState.activeBuffs[buffKey] <= 0) {
          delete skillsState.activeBuffs[buffKey];
        }
      }
    }
  }

  castSkill(skillId) {
    const skill = ACTIVE_SKILLS.find(s => s.id === skillId);
    if (!skill || !this.isSkillUnlocked(skill)) return false;

    // Must be equipped
    if (!this.state.skills.equippedSkills.includes(skillId)) return false;

    const skillsState = this.state.skills;
    if ((skillsState.cooldowns[skill.id] || 0) > 0) return false;

    // Put on cooldown
    skillsState.cooldowns[skill.id] = skill.cooldown;

    // If duration buff
    if (skill.duration > 0 && skill.buffKey) {
      skillsState.activeBuffs[skill.buffKey] = skill.duration;
    }

    // Execute cast logic
    skill.onCast(this.combat, this.stats);
    return true;
  }

  toggleAutoCast(skillId) {
    if (this.state.skills.autoCast[skillId] !== undefined) {
      this.state.skills.autoCast[skillId] = !this.state.skills.autoCast[skillId];
      return this.state.skills.autoCast[skillId];
    }
    this.state.skills.autoCast[skillId] = true;
    return true;
  }

  hasBuff(buffKey) {
    return (this.state.skills.activeBuffs[buffKey] || 0) > 0;
  }
}
