// ============================================================================
// AEGIS ENDLESS - ASCENSION & RELIC META-SYSTEM
// ============================================================================

import { RELICS } from './data.js';

export class MetaManager {
  constructor(state, soundEngine, uiManager) {
    this.state = state;
    this.sound = soundEngine;
    this.ui = uiManager;
  }

  // Calculate pending shards from current run
  getPendingShards() {
    const maxStage = this.state.maxStage || 1;
    if (maxStage < 25) return 0;

    // Formula: Shards based on exponential stage progress + lifetime gold factor
    const stageFactor = Math.floor(Math.pow((maxStage - 20) / 4, 1.8));
    return Math.max(1, stageFactor);
  }

  canAscend() {
    return (this.state.maxStage || 1) >= 25;
  }

  // Perform Rebirth
  performAscension() {
    if (!this.canAscend()) return false;

    const earnedShards = this.getPendingShards();
    const prevMaxStage = this.state.maxStage || 1;
    this.state.shards = (this.state.shards || 0) + earnedShards;
    this.state.ascensions = (this.state.ascensions || 0) + 1;

    // Record lifetime highest stage in stats tracker
    if (!this.state.statsTracker) this.state.statsTracker = {};
    this.state.statsTracker.highestStage = Math.max(this.state.statsTracker.highestStage || 0, prevMaxStage);

    // Reset Current Run Progress Data (furthest stage reached this run resets to 1)
    this.state.stage = 1;
    this.state.maxStage = 1;
    this.state.combatMode = 'grinding';
    this.state.autoPush = false;
    this.state.gold = 0;
    this.state.inventory = [];

    // Reset Character Run Data
    this.state.hero.level = 1;
    this.state.hero.xp = 0;
    this.state.hero.xpToNext = 50;
    this.state.hero.unspentAp = 5;
    this.state.hero.attributes = {
      str: 1,
      dex: 1,
      agi: 1,
      int: 1,
      vit: 1,
      end: 1
    };
    this.state.hero.currentHp = 100;

    // Reset Starter Equipment
    this.state.equipment = {
      mainHand: {
        id: 'starter_sword',
        name: 'Training Blade',
        icon: '',
        sprite: { r: 5, c: 2 },
        type: 'mainHand',
        tier: 1,
        rarity: 'common',
        level: 0,
        baseAtk: 6,
        baseAps: 1.2,
        affixes: [],
        price: 20
      },
      offHand: null,
      helmet: null,
      chest: {
        id: 'starter_tunic',
        name: 'Worn Cloth Tunic',
        icon: '',
        sprite: { r: 7, c: 4 },
        type: 'chest',
        tier: 1,
        rarity: 'common',
        level: 0,
        baseHp: 15,
        baseArmor: 2,
        affixes: [],
        price: 15
      },
      boots: null,
      ring1: null,
      ring2: null,
      amulet: null
    };

    if (this.state.skills) {
      this.state.skills.cooldowns = {};
      this.state.skills.activeBuffs = {};
    }

    this.sound.playLevelUp();
    this.ui.addLog(`[ASCENSION] Reborn! Earned +<strong>${earnedShards} Ancient Shards</strong>. Run stage reset to Stage 1.`, 'log-kill');
    return true;
  }

  // Purchase / Upgrade a Relic with Ancient Shards
  upgradeRelic(relicId) {
    const relicDef = RELICS.find(r => r.id === relicId);
    if (!relicDef) return false;

    const currentRank = this.state.relics[relicId] || 0;
    if (currentRank >= relicDef.maxRank) return false;

    const cost = Math.floor(relicDef.cost * Math.pow(relicDef.costMult, currentRank));
    if (this.state.shards < cost) return false;

    this.state.shards -= cost;
    this.state.relics[relicId] = currentRank + 1;
    this.sound.playCrit();
    this.ui.addLog(`[RELIC UPGRADE] <strong>${relicDef.name}</strong> upgraded to Rank ${this.state.relics[relicId]}!`, 'log-item');
    return true;
  }

  getRelicCost(relicDef) {
    const currentRank = this.state.relics[relicDef.id] || 0;
    return Math.floor(relicDef.cost * Math.pow(relicDef.costMult, currentRank));
  }
}
