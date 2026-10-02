// ============================================================================
// AEGIS ENDLESS - SAVE SYSTEM & OFFLINE PROGRESS CALCULATOR
// ============================================================================

const SAVE_KEY = 'aegis_endless_save_v1';

export class SaveManager {
  constructor(defaultStateFactory) {
    this.defaultStateFactory = defaultStateFactory;
  }

  // Load state from localStorage
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return this.defaultStateFactory();

      const parsed = JSON.parse(raw);
      const defaults = this.defaultStateFactory();

      // Deep merge defaults for schema safety
      return {
        ...defaults,
        ...parsed,
        hero: { ...defaults.hero, ...(parsed.hero || {}) },
        equipment: { ...defaults.equipment, ...(parsed.equipment || {}) },
        relics: { ...defaults.relics, ...(parsed.relics || {}) },
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
        shopStock: Array.isArray(parsed.shopStock) ? parsed.shopStock : []
      };
    } catch (e) {
      console.error('Failed to load save data, resetting to defaults.', e);
      return this.defaultStateFactory();
    }
  }

  // Save state to localStorage
  save(state) {
    try {
      state.lastSaveTimestamp = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save game state', e);
    }
  }

  // Calculate Offline Progress
  calculateOfflineProgress(state, statsManager) {
    if (!state.lastSaveTimestamp) return null;

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastSaveTimestamp) / 1000);

    // Minimum 20 seconds away to trigger offline report, capped at 12 hours (43,200s)
    if (elapsedSeconds < 20) return null;

    const cappedSeconds = Math.min(elapsedSeconds, 43200);
    const farmStage = Math.max(1, state.stage);
    
    // Estimate kills per second on farm stage
    const heroDerived = statsManager.getDerivedStats();
    const mobHp = Math.floor(45 * Math.pow(1.15, farmStage - 1) + (farmStage * 20));
    const timeToKillMob = Math.max(0.6, mobHp / Math.max(1, heroDerived.totalDps));
    const estimatedKills = Math.floor(cappedSeconds / timeToKillMob);

    // Yields per mob
    const goldPerMob = Math.floor((10 + (farmStage * 4.5)) * Math.pow(1.08, farmStage - 1) * (1 + heroDerived.goldFind / 100));
    const xpPerMob = Math.floor((8 + (farmStage * 3.5)) * Math.pow(1.06, farmStage - 1) * (1 + heroDerived.xpBoost / 100));

    const totalOfflineGold = estimatedKills * goldPerMob;
    const totalOfflineXp = estimatedKills * xpPerMob;

    // Apply gains
    state.gold += totalOfflineGold;
    const { finalXp, leveledUp } = statsManager.addXp(totalOfflineXp);

    const formatDuration = (sec) => {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      if (h > 0) return `${h}h ${m}m ${s}s`;
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
    };

    return {
      durationStr: formatDuration(elapsedSeconds),
      kills: estimatedKills,
      gold: totalOfflineGold,
      xp: totalOfflineXp,
      leveledUp
    };
  }

  // Export base64 save string
  exportSaveString(state) {
    state.lastSaveTimestamp = Date.now();
    return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
  }

  // Import base64 save string
  importSaveString(base64Str) {
    try {
      const json = decodeURIComponent(escape(atob(base64Str)));
      const parsed = JSON.parse(json);
      if (parsed.hero && parsed.stage !== undefined) {
        localStorage.setItem(SAVE_KEY, JSON.stringify(parsed));
        return true;
      }
    } catch (e) {
      console.error('Invalid save import', e);
    }
    return false;
  }

  // Hard Reset
  reset() {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }
}
