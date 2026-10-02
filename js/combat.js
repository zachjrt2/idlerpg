// ============================================================================
// AEGIS ENDLESS - COMBAT ENGINE & STATE MACHINE
// ============================================================================

import { BIOMES } from './data.js';

export const COMBAT_MODES = {
  GRINDING: 'grinding',
  PROGRESSION: 'pushing'
};

export class CombatEngine {
  constructor(state, statsManager, soundEngine, uiManager) {
    this.state = state;
    this.stats = statsManager;
    this.sound = soundEngine;
    this.ui = uiManager;
    this.achievements = null;
    this.skills = null;
    this.particles = null;

    // Timers & Combat clocks
    this.heroAttackClock = 0;
    this.enemyAttackClock = 0;
    this.statusTickClock = 0;
    this.regenTickClock = 0;
    this.autoPushClock = 0;

    // Metrics tracking
    this.killsLastMinute = 0;
    this.goldLastMinute = 0;
    this.xpLastMinute = 0;
    this.minuteIntervalClock = 0;

    // Transition stage state
    this.isTransitioning = false;

    // Current Enemy instance
    this.currentEnemy = null;
    this.stageKills = 0;
    this.stageTargetKills = 1;
  }

  setManagers(achievementsManager, skillsManager, particleSystem) {
    this.achievements = achievementsManager;
    this.skills = skillsManager;
    this.particles = particleSystem;
  }

  init() {
    this.spawnEnemyForCurrentStage();
  }

  getBiomeForStage(stage) {
    for (const b of BIOMES) {
      if (stage >= b.minStage && stage <= b.maxStage) {
        return b;
      }
    }
    return BIOMES[BIOMES.length - 1];
  }

  isBossStage(stage) {
    return stage % 10 === 0;
  }

  spawnEnemyForCurrentStage() {
    const stage = this.state.stage;
    const biome = this.getBiomeForStage(stage);
    const isBoss = this.isBossStage(stage);

    // Scaling formulas
    const baseHp = Math.floor(45 * Math.pow(1.15, stage - 1) + (stage * 20));
    const baseAtk = Math.max(3, Math.floor(4 * Math.pow(1.12, stage - 1) + (stage * 1.5)));
    const baseArmor = Math.floor(stage * 2.2);

    let name = '';
    let icon = biome.icon;
    let sprite = null;
    let maxHp = baseHp;
    let atk = baseAtk;
    let aps = 0.9;

    if (this.particles) {
      this.particles.setBiome(biome.id);
    }

    if (isBoss) {
      name = biome.boss.name;
      sprite = { sheet: biome.boss.sheet, r: biome.boss.r, c: biome.boss.c };
      maxHp = Math.floor(baseHp * biome.boss.hpMult);
      atk = Math.floor(baseAtk * biome.boss.dmgMult);
      aps = 0.8;
    } else {
      const mobList = biome.enemies || [];
      const mobIdx = Math.abs(this.stageKills + stage - 1) % (mobList.length || 1);
      const mobDef = mobList[mobIdx] || { name: 'Wild Beast', sheet: 'BASIC_MONSTERS', r: 0, c: 0 };
      name = mobDef.name;
      sprite = { sheet: mobDef.sheet, r: mobDef.r, c: mobDef.c };
    }

    // Gold and XP yields
    const goldYield = Math.floor((10 + (stage * 4.5)) * Math.pow(1.08, stage - 1));
    const xpYield = Math.floor((8 + (stage * 3.5)) * Math.pow(1.06, stage - 1));

    this.currentEnemy = {
      name,
      icon,
      sprite,
      isBoss,
      stage,
      maxHp,
      currentHp: maxHp,
      atk,
      armor: baseArmor,
      aps,
      goldYield,
      xpYield,
      statusEffects: {
        poison: { stacks: 0, dmgPerStack: 0, duration: 0 }
      }
    };

    this.enemyAttackClock = 0;
  }

  toggleCombatMode() {
    if (this.state.combatMode === COMBAT_MODES.GRINDING) {
      this.state.combatMode = COMBAT_MODES.PROGRESSION;
      this.state.stage = this.state.maxStage;
      this.stageKills = 0;
      this.spawnEnemyForCurrentStage();
      this.ui.addLog(`[PROGRESSION MODE] Pushing forward from Stage ${this.state.stage}.`, 'log-system');
    } else {
      this.state.combatMode = COMBAT_MODES.GRINDING;
      this.ui.addLog(`[GRINDING MODE] Farming Stage ${this.state.stage} safely.`, 'log-system');
    }
  }

  tick(dt) {
    // Pause combat ticks while transitioning between stages
    if (this.isTransitioning) {
      return;
    }

    if (!this.currentEnemy) return;

    // 0. Update Skills Clock
    if (this.skills) {
      this.skills.tick(dt);
    }

    const heroDerived = this.stats.getDerivedStats();

    // Ensure hero current HP is capped
    if (this.state.hero.currentHp > heroDerived.maxHp) {
      this.state.hero.currentHp = heroDerived.maxHp;
    }

    // 1. Health Regen Tick (every 1.0s)
    this.regenTickClock += dt;
    if (this.regenTickClock >= 1.0) {
      this.regenTickClock = 0;
      const regenAmount = parseFloat(heroDerived.hpRegen);
      if (regenAmount > 0 && this.state.hero.currentHp < heroDerived.maxHp) {
        this.state.hero.currentHp = Math.min(heroDerived.maxHp, this.state.hero.currentHp + regenAmount);
        this.ui.spawnDamageSplat(Math.round(regenAmount), 'heal', 'hero');
      }
    }

    // 2. Status Effect Tick (every 0.5s)
    this.statusTickClock += dt;
    if (this.statusTickClock >= 0.5) {
      this.statusTickClock = 0;
      this.processStatusTicks();
    }

    // 3. Hero Attack Cycle
    this.heroAttackClock += dt;
    const heroAttackPeriod = 1.0 / parseFloat(heroDerived.aps);
    if (this.heroAttackClock >= heroAttackPeriod) {
      this.heroAttackClock = 0;
      this.executeHeroAttack(heroDerived);
    }

    // 4. Enemy Attack Cycle
    if (this.currentEnemy && this.currentEnemy.currentHp > 0) {
      this.enemyAttackClock += dt;
      const enemyAttackPeriod = 1.0 / this.currentEnemy.aps;
      if (this.enemyAttackClock >= enemyAttackPeriod) {
        this.enemyAttackClock = 0;
        this.executeEnemyAttack(heroDerived);
      }
    }

    // 5. Auto-Push Logic (if enabled and on safe stage after recovery)
    if (this.state.autoPush && this.state.combatMode === COMBAT_MODES.GRINDING) {
      this.autoPushClock += dt;
      if (this.autoPushClock >= 6.0 && this.state.hero.currentHp >= (heroDerived.maxHp * 0.95)) {
        this.autoPushClock = 0;
        this.toggleCombatMode();
        this.ui.renderArena();
      }
    }

    // 6. Metrics tracking (KPM, GPM, XPM)
    this.minuteIntervalClock += dt;
    if (this.minuteIntervalClock >= 60.0) {
      this.minuteIntervalClock = 0;
      this.killsLastMinute = 0;
      this.goldLastMinute = 0;
      this.xpLastMinute = 0;
    }
  }

  getHeroCoords() {
    const container = document.getElementById('battlefield-container');
    const heroEl = document.getElementById('hero-sprite') || document.getElementById('arena-hero');
    if (container && heroEl) {
      const cRect = container.getBoundingClientRect();
      const hRect = heroEl.getBoundingClientRect();
      if (hRect.width > 0 && cRect.width > 0) {
        return {
          x: hRect.left - cRect.left + (hRect.width / 2),
          y: hRect.top - cRect.top + (hRect.height * 0.5)
        };
      }
    }
    const bounds = container?.getBoundingClientRect();
    return {
      x: bounds ? bounds.width * 0.25 : 100,
      y: bounds ? bounds.height * 0.55 : 110
    };
  }

  getEnemyCoords() {
    const container = document.getElementById('battlefield-container');
    const enemyEl = document.getElementById('enemy-sprite') || document.getElementById('arena-enemy');
    if (container && enemyEl) {
      const cRect = container.getBoundingClientRect();
      const eRect = enemyEl.getBoundingClientRect();
      if (eRect.width > 0 && cRect.width > 0) {
        return {
          x: eRect.left - cRect.left + (eRect.width / 2),
          y: eRect.top - cRect.top + (eRect.height * 0.5)
        };
      }
    }
    const bounds = container?.getBoundingClientRect();
    return {
      x: bounds ? bounds.width * 0.75 : 300,
      y: bounds ? bounds.height * 0.55 : 110
    };
  }

  executeHeroAttack(heroDerived) {
    if (!this.currentEnemy || this.currentEnemy.currentHp <= 0) return;

    this.ui.triggerHeroAttackVisual();

    const { x: enemyX, y: enemyY } = this.getEnemyCoords();
    const { x: heroX, y: heroY } = this.getHeroCoords();

    // Dust kickup under hero feet
    if (this.particles) {
      this.particles.spawnStepDust(heroX, heroY + 20, 3);
    }

    // Check Multi-strike
    const multiStrikeRoll = Math.random() * 100;
    const hitCount = multiStrikeRoll < parseFloat(heroDerived.multiStrike) ? 2 : 1;

    for (let i = 0; i < hitCount; i++) {
      const isCrit = (Math.random() * 100) < parseFloat(heroDerived.critChance);
      let hitDmg = heroDerived.atk;
      
      if (isCrit) {
        hitDmg = Math.floor(hitDmg * (heroDerived.critMult / 100));
        this.sound.playCrit();
        if (this.particles) {
          this.particles.spawnSlashArc(enemyX, enemyY, true, 35);
          this.particles.spawnCritShards(enemyX, enemyY, 18);
          this.particles.spawnShockwave(enemyX, enemyY, '#fbbf24', 55, 0.25);
        }
      } else {
        this.sound.playSlash();
        if (this.particles) {
          this.particles.spawnSlashArc(enemyX, enemyY, false, 30);
          this.particles.spawnSparks(enemyX, enemyY, '#93c5fd', 10, 1.0);
        }
      }

      // Armor reduction
      const enemyArmor = Math.max(0, this.currentEnemy.armor * (1 - (parseFloat(heroDerived.armorPen) / 100)));
      const dmgReduction = enemyArmor / (enemyArmor + 60);
      const finalDmg = Math.max(1, Math.floor(hitDmg * (1 - dmgReduction)));

      // Apply Damage to Enemy
      this.currentEnemy.currentHp -= finalDmg;
      this.ui.spawnDamageSplat(finalDmg, isCrit ? 'crit' : 'normal', 'enemy', i > 0);
      this.ui.triggerEnemyHit(isCrit);

      // Life Steal Healing
      const lifestealPercent = parseFloat(heroDerived.lifeSteal);
      if (lifestealPercent > 0) {
        const leechAmount = Math.max(1, Math.floor(finalDmg * (lifestealPercent / 100)));
        this.state.hero.currentHp = Math.min(heroDerived.maxHp, this.state.hero.currentHp + leechAmount);
        this.ui.spawnDamageSplat(leechAmount, 'heal', 'hero');
        if (this.particles) {
          this.particles.spawnLifeLeech(enemyX, enemyY, heroX, heroY, 5);
        }
      }

      // Poison Infliction check
      if ((Math.random() * 100) < parseFloat(heroDerived.poisonChance)) {
        const poison = this.currentEnemy.statusEffects.poison;
        poison.stacks = Math.min(40, poison.stacks + 1);
        poison.dmgPerStack = Math.max(poison.dmgPerStack, Math.floor(heroDerived.poisonDmg / 2));
        poison.duration = 4.0;
        
        if (this.achievements) {
          this.achievements.trackPoisonStacks(poison.stacks);
        }

        if (this.particles) {
          this.particles.spawnPoisonBubbles(enemyX, enemyY, 6);
          this.particles.spawnBloodSplatter(enemyX, enemyY, 6, true);
        }
      }

      if (this.currentEnemy.currentHp <= 0) {
        this.onEnemyDefeated();
        break;
      }
    }
  }

  executeEnemyAttack(heroDerived) {
    if (!this.currentEnemy) return;

    this.ui.triggerEnemyAttackVisual();

    const { x: heroX, y: heroY } = this.getHeroCoords();

    // 1. Dodge Check
    const dodgeRoll = Math.random() * 100;
    if (dodgeRoll < parseFloat(heroDerived.dodge)) {
      this.ui.spawnDamageSplat('DODGE!', 'dodge', 'hero');
      if (this.particles) {
        this.particles.spawnStepDust(heroX, heroY + 15, 4);
      }
      return;
    }

    // 2. Block Check
    const blockRoll = Math.random() * 100;
    let blockMitigation = 0;
    if (blockRoll < parseFloat(heroDerived.block)) {
      blockMitigation = 0.5;
      if (this.particles) {
        this.particles.spawnShieldBurst(heroX, heroY);
      }
    }

    // 3. Armor Damage Reduction
    const dr = parseFloat(heroDerived.dr) / 100;
    let incomingDmg = this.currentEnemy.atk * (1 - dr);
    if (blockMitigation > 0) {
      incomingDmg *= (1 - blockMitigation);
      this.ui.spawnDamageSplat('BLOCKED!', 'dodge', 'hero');
    }

    const finalDmg = Math.max(1, Math.floor(incomingDmg));
    this.state.hero.currentHp -= finalDmg;
    this.ui.spawnDamageSplat(finalDmg, 'normal', 'hero');
    this.ui.triggerHeroHit(false);

    if (this.particles && blockMitigation === 0) {
      this.particles.spawnBloodSplatter(heroX, heroY, 6);
    }

    // 4. Thorns / Reflect Damage back to Enemy
    const thornsDmg = heroDerived.thorns;
    if (thornsDmg > 0 && this.currentEnemy.currentHp > 0) {
      this.currentEnemy.currentHp -= thornsDmg;
      this.ui.spawnDamageSplat(thornsDmg, 'thorns', 'enemy');
      this.ui.triggerEnemyHit(false);
      const { x: enemyX, y: enemyY } = this.getEnemyCoords();
      if (this.particles) {
        this.particles.spawnSparks(enemyX, enemyY, '#c084fc', 8);
      }
      if (this.currentEnemy.currentHp <= 0) {
        this.onEnemyDefeated();
        return;
      }
    }

    // 5. Hero Wipeout Check
    if (this.state.hero.currentHp <= 0) {
      this.handleHeroDefeat();
    }
  }

  processStatusTicks() {
    if (!this.currentEnemy || this.currentEnemy.currentHp <= 0) return;

    const poison = this.currentEnemy.statusEffects.poison;
    if (poison.stacks > 0 && poison.duration > 0) {
      const poisonTickDmg = poison.stacks * poison.dmgPerStack;
      this.currentEnemy.currentHp -= poisonTickDmg;
      this.ui.spawnDamageSplat(poisonTickDmg, 'poison', 'enemy');
      this.ui.triggerPoisonVisual('enemy');
      this.sound.playPoisonTick();

      if (this.particles) {
        const { x: enemyX, y: enemyY } = this.getEnemyCoords();
        this.particles.spawnPoisonBubbles(enemyX, enemyY, 5);
      }

      poison.duration -= 0.5;
      if (poison.duration <= 0) {
        poison.stacks = 0;
      }

      if (this.currentEnemy.currentHp <= 0) {
        this.onEnemyDefeated();
      }
    }
  }

  onEnemyDefeated() {
    const enemy = this.currentEnemy;
    const heroDerived = this.stats.getDerivedStats();

    this.ui.triggerEnemyDefeatVisual();

    const { x: enemyX, y: enemyY } = this.getEnemyCoords();

    // Juice: Fountain of gold coins bursting on kill
    if (this.particles) {
      this.particles.spawnCoinFountain(enemyX, enemyY, enemy.isBoss ? 20 : 10);
      this.particles.spawnShockwave(enemyX, enemyY, '#fbbf24', 65, 0.35);
      this.particles.spawnCritShards(enemyX, enemyY, 12);
    }

    if (enemy.isBoss) {
      this.ui.triggerScreenShake('heavy');
    }

    // Gold calculation
    const goldBonus = heroDerived.goldFind / 100;
    const finalGold = Math.floor(enemy.goldYield * (1 + goldBonus));
    this.state.gold += finalGold;
    this.sound.playGold();

    if (this.achievements) {
      this.achievements.trackKill();
      this.achievements.trackGold(finalGold);
    }

    // XP calculation
    const { finalXp, leveledUp } = this.stats.addXp(enemy.xpYield);
    if (leveledUp) {
      this.sound.playLevelUp();
      this.ui.addLog(`[LEVEL UP] You reached Level ${this.state.hero.level} (+5 Stat Points).`, 'log-kill');
      if (this.particles && arenaBounds) {
        this.particles.spawnShieldBurst(arenaBounds.width * 0.22, arenaBounds.height * 0.5);
      }
    }

    // Metrics
    this.killsLastMinute += 1;
    this.goldLastMinute += finalGold;
    this.xpLastMinute += finalXp;

    // Log kill
    if (enemy.isBoss) {
      this.ui.addLog(`[BOSS SLAIN] Defeated ${enemy.name}! (+${finalGold} Gold, +${finalXp} XP)`, 'log-kill');
    }

    // State Progression Check
    if (this.state.combatMode === COMBAT_MODES.PROGRESSION) {
      this.stageKills += 1;
      
      if (this.stageKills >= this.stageTargetKills || enemy.isBoss) {
        this.stageKills = 0;
        this.state.stage += 1;
        if (this.state.stage > this.state.maxStage) {
          this.state.maxStage = this.state.stage;
          this.ui.addLog(`[STAGE CLEARED] Unlocked Stage ${this.state.maxStage}!`, 'log-system');
        }
      }
    }

    // Trigger visual walk-off right -> fade-to-black -> fade-in & walk-on stage transition
    this.isTransitioning = true;
    this.ui.triggerStageTransition(
      () => {
        this.spawnEnemyForCurrentStage();
        this.ui.renderArena();
      },
      () => {
        this.isTransitioning = false;
      }
    );

    if (this.particles && arenaBounds) {
      this.particles.spawnStepDust(arenaBounds.width * 0.22, arenaBounds.height * 0.65, 6);
    }
  }

  handleHeroDefeat() {
    this.sound.playDefeat();
    const heroDerived = this.stats.getDerivedStats();

    this.state.hero.currentHp = heroDerived.maxHp;

    if (this.state.combatMode === COMBAT_MODES.PROGRESSION) {
      this.ui.addLog(`[DEFEAT] Hero fell at Stage ${this.state.stage}. Falling back to safe Grinding Mode.`, 'log-defeat');
      
      this.state.combatMode = COMBAT_MODES.GRINDING;
      this.state.stage = Math.max(1, this.state.maxStage > 1 ? this.state.maxStage - 1 : 1);
      this.stageKills = 0;
      this.autoPushClock = 0;
      this.spawnEnemyForCurrentStage();
    } else {
      this.spawnEnemyForCurrentStage();
    }
  }

  setGrindStage(stageNum) {
    if (stageNum >= 1 && stageNum <= this.state.maxStage) {
      this.state.stage = stageNum;
      this.state.combatMode = COMBAT_MODES.GRINDING;
      this.stageKills = 0;
      this.spawnEnemyForCurrentStage();
    }
  }
}
