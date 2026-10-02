// ============================================================================
// AEGIS ENDLESS - MAIN ENTRY & GAME LOOP
// ============================================================================

import { StatsManager } from './stats.js';
import { SoundEngine } from './audio.js';
import { CombatEngine, COMBAT_MODES } from './combat.js';
import { ShopManager } from './shop.js';
import { MetaManager } from './meta.js';
import { SaveManager } from './save.js';
import { UIManager } from './ui.js';
import { SkillsManager } from './skills.js';
import { AchievementsManager } from './achievements.js';
import { ParticleSystem } from './particles.js';

// Default Fresh Game State Factory
function createDefaultGameState() {
  return {
    stage: 1,
    maxStage: 1,
    combatMode: COMBAT_MODES.PROGRESSION,
    autoPush: true,
    gold: 50,
    shards: 0,
    ascensions: 0,
    lastSaveTimestamp: Date.now(),
    hero: {
      level: 1,
      xp: 0,
      xpToNext: 50,
      unspentAp: 5,
      currentHp: 100,
      attributes: {
        str: 1,
        dex: 1,
        agi: 1,
        int: 1,
        vit: 1,
        end: 1
      }
    },
    equipment: {
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
    },
    inventory: [],
    shopStock: [],
    relics: {},
    skills: {
      cooldowns: {},
      activeBuffs: {},
      autoCast: {
        venom_nova: true,
        blade_flurry: true,
        blood_feast: true,
        iron_bastion: true
      }
    },
    statsTracker: {
      totalKills: 0,
      totalGoldEarned: 0,
      totalXpEarned: 0,
      highestDamageHit: 0,
      highestPoisonStacks: 0,
      highestEnhanceLevel: 0
    },
    unlockedAchievements: {}
  };
}

// Global Speed multiplier (1.0 or 2.0)
// Simulation Speed default: 1/3 speed (0.33x) for clean, readable combat pacing
window.gameSpeed = 0.33;

window.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Core Managers
  const saveManager = new SaveManager(createDefaultGameState);
  const gameState = saveManager.load();

  const soundEngine = new SoundEngine();
  const uiManager = new UIManager();
  const achievementsManager = new AchievementsManager(gameState, soundEngine, uiManager);
  const statsManager = new StatsManager(gameState, achievementsManager, null);
  const combatEngine = new CombatEngine(gameState, statsManager, soundEngine, uiManager);
  const skillsManager = new SkillsManager(gameState, combatEngine, statsManager, soundEngine, uiManager);
  const shopManager = new ShopManager(gameState, statsManager, soundEngine, uiManager);
  const metaManager = new MetaManager(gameState, soundEngine, uiManager);

  // Cross-reference managers
  statsManager.setManagers(achievementsManager, skillsManager);
  shopManager.setAchievements(achievementsManager);

  // 2. Setup Particle Canvas
  const canvas = document.getElementById('battle-particles-canvas');
  const particleSystem = new ParticleSystem(canvas);
  combatEngine.setManagers(achievementsManager, skillsManager, particleSystem);

  // 3. Wire UI bindings
  uiManager.bindManagers(gameState, statsManager, combatEngine, shopManager, metaManager, saveManager, soundEngine, skillsManager, achievementsManager);

  // 4. Initialize Subsystems
  shopManager.init();
  combatEngine.init();

  // 5. Offline Calculation
  const offlineReport = saveManager.calculateOfflineProgress(gameState, statsManager);

  // 6. Initial Render
  uiManager.renderAll();

  // Initialize and dismiss first-load splash screen
  const splashEl = document.getElementById('splash-screen');
  if (splashEl) {
    let dismissed = false;
    const dismissSplash = () => {
      if (dismissed) return;
      dismissed = true;
      try {
        if (soundEngine && typeof soundEngine.initContext === 'function') {
          soundEngine.initContext();
        }
      } catch (e) {
        // Ignore audio gesture restrictions
      }
      splashEl.classList.add('fade-out');
      setTimeout(() => {
        if (splashEl.parentNode) {
          splashEl.remove();
        }
      }, 650);
    };

    splashEl.addEventListener('click', dismissSplash);
    window.addEventListener('keydown', dismissSplash, { once: true });
    setTimeout(dismissSplash, 1000);
  }

  if (offlineReport) {
    uiManager.showOfflineModal(offlineReport);
  }

  // 7. High-FPS Particle Render Loop
  function animationLoop() {
    particleSystem.updateAndDraw();
    requestAnimationFrame(animationLoop);
  }
  requestAnimationFrame(animationLoop);

  // 8. Fixed Combat Simulation Loop (100ms ticks)
  let lastTime = performance.now();
  const TICK_INTERVAL_MS = 100;

  setInterval(() => {
    const now = performance.now();
    const dt = ((now - lastTime) / 1000) * window.gameSpeed;
    lastTime = now;

    // Run combat logic & skill timers
    combatEngine.tick(dt);

    // Continuous UI updates for dynamic battle bars, numbers & cooldowns
    uiManager.renderArena();
    uiManager.renderSkillsBar();
    uiManager.renderHeader();
  }, TICK_INTERVAL_MS);

  // 9. Slower UI Refresh Loop (Every 500ms for hero stats)
  setInterval(() => {
    uiManager.renderHeroPanel();
  }, 500);

  // 10. Auto-Save Loop (Every 4 seconds)
  setInterval(() => {
    saveManager.save(gameState);
  }, 4000);

  // Save before unload
  window.addEventListener('beforeunload', () => {
    saveManager.save(gameState);
  });
});
