// ============================================================================
// AEGIS ENDLESS - ACHIEVEMENTS & TROPHIES ENGINE
// ============================================================================

export const ACHIEVEMENTS = [
  {
    id: 'first_blood',
    name: 'First Blood',
    sprite: { r: 3, c: 0 },
    desc: 'Slay your first enemy monster.',
    rewardDesc: '+5% Attack Damage',
    check: (tracker) => tracker.totalKills >= 1,
    effect: { atkMult: 0.05 }
  },
  {
    id: 'monster_hunter',
    name: 'Monster Hunter',
    sprite: { r: 5, c: 8 },
    desc: 'Slay 50 monsters in the Gauntlet.',
    rewardDesc: '+10% XP Boost',
    check: (tracker) => tracker.totalKills >= 50,
    effect: { xpBoost: 10 }
  },
  {
    id: 'forest_champion',
    name: 'Forest Champion',
    sprite: { r: 4, c: 6 },
    desc: 'Clear Stage 10 and defeat the Ancient Treant King.',
    rewardDesc: '+15% Gold Find',
    check: (tracker, state) => (state.maxStage || 1) > 10,
    effect: { goldFind: 15 }
  },
  {
    id: 'venom_specialist',
    name: 'Venom Specialist',
    sprite: { r: 0, c: 1 },
    desc: 'Inflict 15 or more Poison Stacks on an enemy.',
    rewardDesc: '+25% Poison & DoT Scaling',
    check: (tracker) => tracker.highestPoisonStacks >= 15,
    effect: { poisonDmgMult: 0.25 }
  },
  {
    id: 'wealthy_adventurer',
    name: 'Golden Hoarder',
    sprite: { r: 12, c: 10 },
    desc: 'Accumulate 10,000 total lifetime Gold.',
    rewardDesc: '+15% Gold Find & +5 Luck',
    check: (tracker) => tracker.totalGoldEarned >= 10000,
    effect: { goldFind: 15, luck: 5 }
  },
  {
    id: 'master_smith',
    name: 'Master of the Forge',
    sprite: { r: 4, c: 4 },
    desc: 'Enhance any item to level +5 or higher.',
    rewardDesc: '+10% Base Armor & +5% Damage',
    check: (tracker) => tracker.highestEnhanceLevel >= 5,
    effect: { armorMult: 0.10, atkMult: 0.05 }
  },
  {
    id: 'ascended_being',
    name: 'Ascended Soul',
    sprite: { r: 3, c: 15 },
    desc: 'Complete your first Ancient Ascension Rebirth.',
    rewardDesc: '+20% Global DPS & +20% HP',
    check: (tracker, state) => (state.ascensions || 0) >= 1,
    effect: { atkMult: 0.20, maxHpMult: 0.20 }
  }
];

export class AchievementsManager {
  constructor(state, soundEngine, uiManager) {
    this.state = state;
    this.sound = soundEngine;
    this.ui = uiManager;

    // Ensure trackers in state
    if (!this.state.statsTracker) {
      this.state.statsTracker = {
        totalKills: 0,
        totalGoldEarned: 0,
        totalXpEarned: 0,
        highestDamageHit: 0,
        highestPoisonStacks: 0,
        highestEnhanceLevel: 0
      };
    }

    if (!this.state.unlockedAchievements) {
      this.state.unlockedAchievements = {};
    }
  }

  trackKill() {
    this.state.statsTracker.totalKills += 1;
    this.checkAll();
  }

  trackGold(amount) {
    this.state.statsTracker.totalGoldEarned += amount;
    this.checkAll();
  }

  trackPoisonStacks(stacks) {
    if (stacks > this.state.statsTracker.highestPoisonStacks) {
      this.state.statsTracker.highestPoisonStacks = stacks;
      this.checkAll();
    }
  }

  trackEnhanceLevel(lvl) {
    if (lvl > this.state.statsTracker.highestEnhanceLevel) {
      this.state.statsTracker.highestEnhanceLevel = lvl;
      this.checkAll();
    }
  }

  checkAll() {
    const tracker = this.state.statsTracker;
    const unlocked = this.state.unlockedAchievements;

    for (const ach of ACHIEVEMENTS) {
      if (!unlocked[ach.id]) {
        if (ach.check(tracker, this.state)) {
          unlocked[ach.id] = true;
          this.sound.playLevelUp();
          this.ui.addLog(`[TROPHY UNLOCKED] <strong>${ach.name}</strong> (${ach.rewardDesc})`, 'log-kill');
        }
      }
    }
  }

  getAchievementBonuses() {
    const bonuses = {
      atkMult: 0,
      maxHpMult: 0,
      armorMult: 0,
      poisonDmgMult: 0,
      goldFind: 0,
      xpBoost: 0,
      luck: 0
    };

    const unlocked = this.state.unlockedAchievements || {};
    for (const ach of ACHIEVEMENTS) {
      if (unlocked[ach.id] && ach.effect) {
        for (const [k, v] of Object.entries(ach.effect)) {
          bonuses[k] = (bonuses[k] || 0) + v;
        }
      }
    }

    return bonuses;
  }
}
