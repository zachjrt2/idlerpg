// ============================================================================
// AEGIS ENDLESS - UI RENDERER & INTERACTION CONTROLLER
// ============================================================================

import { ITEM_TYPES, RARITIES, RELICS, HERO_SPRITES } from './data.js';
import { ACTIVE_SKILLS, SKILL_SLOT_LEVELS } from './skills.js';
import { ACHIEVEMENTS } from './achievements.js';
import { renderItemIcon, renderFighterSprite } from './art.js';

export class UIManager {
  constructor() {
    this.state = null;
    this.stats = null;
    this.combat = null;
    this.shop = null;
    this.meta = null;
    this.save = null;
    this.sound = null;
    this.skills = null;
    this.achievements = null;
    this.apStep = 1; // 1, 5, 10, or 'max'

    // DOM Elements Cache
    this.dom = {};
  }

  bindManagers(state, stats, combat, shop, meta, save, sound, skills, achievements) {
    this.state = state;
    this.stats = stats;
    this.combat = combat;
    this.shop = shop;
    this.meta = meta;
    this.save = save;
    this.sound = sound;
    this.skills = skills;
    this.achievements = achievements;

    this.cacheDom();
    this.bindEvents();
    this.bindHotkeys();
    this.switchMainTab('tab-battle');
  }

  cacheDom() {
    this.dom = {
      // Header
      goldDisplay: document.getElementById('gold-display'),
      shardsDisplay: document.getElementById('shards-display'),
      dpsDisplay: document.getElementById('dps-display'),
      btnOptionsMenu: document.getElementById('btn-options-menu'),

      // Left: Hero & Stats
      heroAvatar: document.getElementById('hero-avatar'),
      heroLevel: document.getElementById('hero-level'),
      heroHpText: document.getElementById('hero-hp-text'),
      heroHpFill: document.getElementById('hero-hp-fill'),
      heroXpText: document.getElementById('hero-xp-text'),
      heroXpFill: document.getElementById('hero-xp-fill'),
      heroArchetypeTag: document.getElementById('hero-archetype-tag'),
      unspentAp: document.getElementById('unspent-ap'),
      btnRespec: document.getElementById('btn-respec'),
      attributeRows: document.getElementById('attribute-rows'),

      // Derived Stats
      statAtk: document.getElementById('stat-atk'),
      statAps: document.getElementById('stat-aps'),
      statCritChance: document.getElementById('stat-crit-chance'),
      statCritMult: document.getElementById('stat-crit-mult'),
      statMultiStrike: document.getElementById('stat-multistrike'),
      statArmorPen: document.getElementById('stat-armor-pen'),
      statPoison: document.getElementById('stat-poison'),
      statBleed: document.getElementById('stat-bleed'),
      statMaxHp: document.getElementById('stat-max-hp'),
      statArmor: document.getElementById('stat-armor'),
      statDr: document.getElementById('stat-dr'),
      statDodge: document.getElementById('stat-dodge'),
      statBlock: document.getElementById('stat-block'),
      statThorns: document.getElementById('stat-thorns'),
      statLifeSteal: document.getElementById('stat-lifesteal'),
      statRegen: document.getElementById('stat-regen'),
      statGoldFind: document.getElementById('stat-gold-find'),
      statXpBonus: document.getElementById('stat-xp-bonus'),
      statLuck: document.getElementById('stat-luck'),
      statTickSpeed: document.getElementById('stat-tick-speed'),

      // Center: Arena
      zoneName: document.getElementById('zone-name'),
      currentStageNum: document.getElementById('current-stage-num'),
      biomeIcon: document.getElementById('biome-icon'),
      bossIndicator: document.getElementById('boss-indicator'),
      stageSelectLabel: document.getElementById('stage-select-label'),
      btnPrevStage: document.getElementById('btn-prev-stage'),
      btnNextStage: document.getElementById('btn-next-stage'),
      modeStatusText: document.getElementById('mode-status-text'),
      modeSubText: document.getElementById('mode-sub-text'),
      chkAutoPush: document.getElementById('chk-auto-push'),
      btnTogglePush: document.getElementById('btn-toggle-push'),
      battlefieldContainer: document.getElementById('battlefield-container'),
      biomeScenery: document.getElementById('biome-scenery'),
      biomeBackdrop: document.getElementById('biome-backdrop'),
      biomeMidground: document.getElementById('biome-midground'),
      biomeProps: document.getElementById('biome-props'),
      arenaPlatform: document.getElementById('arena-platform'),
      arenaFadeOverlay: document.getElementById('arena-fade-overlay'),
      arenaHero: document.getElementById('arena-hero'),
      heroSprite: document.getElementById('hero-sprite'),
      arenaEnemy: document.getElementById('arena-enemy'),
      enemySprite: document.getElementById('enemy-sprite'),
      enemyName: document.getElementById('enemy-name'),
      arenaHeroHp: document.getElementById('arena-hero-hp'),
      arenaEnemyHp: document.getElementById('arena-enemy-hp'),
      heroStatusTray: document.getElementById('hero-status-tray'),
      enemyStatusTray: document.getElementById('enemy-status-tray'),
      damageSplatLayer: document.getElementById('damage-splat-layer'),
      skillsBar: document.getElementById('skills-bar'),
      arenaKillsCount: document.getElementById('arena-kills-count'),
      arenaKpm: document.getElementById('arena-kpm'),
      arenaGpm: document.getElementById('arena-gpm'),
      arenaXpm: document.getElementById('arena-xpm'),
      combatLog: document.getElementById('combat-log'),
      btnClearLog: document.getElementById('btn-clear-log'),

      // Mobile Nav & Tabs
      mobileNavBtns: document.querySelectorAll('.mobile-nav-btn'),
      tabViews: document.querySelectorAll('.tab-view'),
      subTabBtns: document.querySelectorAll('.sub-tab-btn'),
      subTabViews: document.querySelectorAll('.sub-tab-view'),
      miniBattleHud: document.getElementById('mini-battle-hud'),
      miniZoneName: document.getElementById('mini-zone-name'),
      miniStageNum: document.getElementById('mini-stage-num'),
      miniModeTag: document.getElementById('mini-mode-tag'),
      miniHeroHpFill: document.getElementById('mini-hero-hp-fill'),
      miniEnemyHpFill: document.getElementById('mini-enemy-hp-fill'),
      btnMiniReturnBattle: document.getElementById('btn-mini-return-battle'),
      navApBadge: document.getElementById('nav-ap-badge'),
      navInvBadge: document.getElementById('nav-inv-badge'),
      navAscendBadge: document.getElementById('nav-ascend-badge'),

      gearSlots: document.getElementById('gear-slots'),
      inventoryGrid: document.getElementById('inventory-grid'),
      invCount: document.getElementById('inv-count'),
      btnSalvageAll: document.getElementById('btn-salvage-all'),
      btnMergeJunk: document.getElementById('btn-merge-junk'),
      shopItemsList: document.getElementById('shop-items-list'),
      btnRefreshShop: document.getElementById('btn-refresh-shop'),
      shopRefreshCost: document.getElementById('shop-refresh-cost'),
      
      // Crucible & Forge
      crucibleSlotsContainer: document.getElementById('crucible-slots-container'),
      crucibleBackpackGrid: document.getElementById('crucible-backpack-grid'),
      crucibleMultTag: document.getElementById('crucible-mult-tag'),
      oddsBreakdownBar: document.getElementById('odds-breakdown-bar'),
      oddPctUncommon: document.getElementById('odd-pct-uncommon'),
      oddPctRare: document.getElementById('odd-pct-rare'),
      oddPctEpic: document.getElementById('odd-pct-epic'),
      oddPctLegendary: document.getElementById('odd-pct-legendary'),
      oddPctMythic: document.getElementById('odd-pct-mythic'),
      oddPctTier: document.getElementById('odd-pct-tier'),
      btnCrucibleAutofill: document.getElementById('btn-crucible-autofill'),
      btnCrucibleClear: document.getElementById('btn-crucible-clear'),
      btnCrucibleFuse: document.getElementById('btn-crucible-fuse'),

      forgeItemPreview: document.getElementById('forge-item-preview'),
      upgradeGearPicker: document.getElementById('upgrade-gear-picker'),
      forgeActions: document.getElementById('forge-actions'),
      btnForgeEnhance: document.getElementById('btn-forge-enhance'),
      forgeEnhanceCost: document.getElementById('forge-enhance-cost'),
      btnForgeReforge: document.getElementById('btn-forge-reforge'),
      forgeReforgeCost: document.getElementById('forge-reforge-cost'),
      btnForgeSalvage: document.getElementById('btn-forge-salvage'),
      forgeSalvageYield: document.getElementById('forge-salvage-yield'),
      ascendMaxStage: document.getElementById('ascend-max-stage'),
      ascendReqText: document.getElementById('ascend-req-text'),
      ascendPendingShards: document.getElementById('ascend-pending-shards'),
      btnPerformAscend: document.getElementById('btn-perform-ascend'),
      relicsList: document.getElementById('relics-list'),
      achievementsList: document.getElementById('achievements-list'),

      // Tooltips & Modals
      itemTooltip: document.getElementById('item-tooltip'),
      modalOverlay: document.getElementById('modal-overlay'),
      modalContent: document.getElementById('modal-content')
    };
  }

  // Switch Mobile & Primary Tab View
  switchMainTab(tabId) {
    if (tabId === 'tab-forge') tabId = 'tab-shop';
    this.activeMainTab = tabId;
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mainTab === tabId || (tabId === 'tab-shop' && btn.dataset.mainTab === 'tab-forge'));
    });

    document.querySelectorAll('.tab-view').forEach(view => {
      const isTarget = view.id === tabId || (tabId === 'tab-shop' && view.id === 'tab-forge') || (tabId === 'tab-forge' && view.id === 'tab-shop');
      view.classList.toggle('active', isTarget);
      if (view.id === 'tab-gear' || view.id === 'tab-forge' || view.id === 'tab-shop' || view.id === 'tab-ascend') {
        view.classList.toggle('desktop-hidden', !isTarget && tabId !== 'tab-battle' && tabId !== 'tab-hero');
      }
    });

    if (tabId === 'tab-battle') {
      document.body.classList.remove('on-sub-tab');
    } else {
      document.body.classList.add('on-sub-tab');
    }

    if (tabId === 'tab-ascend') {
      this.renderAscensionView();
      this.renderAchievementsView();
    } else if (tabId === 'tab-shop' || tabId === 'tab-forge') {
      this.renderShopView();
      this.renderForgeView();
    } else if (tabId === 'tab-gear') {
      this.renderEquipmentView();
    } else if (tabId === 'tab-hero') {
      this.renderHeroPanel();
    } else if (tabId === 'tab-battle') {
      this.renderArena();
    }
  }

  bindEvents() {
    // Mobile Bottom Nav Tabs
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.mainTab;
        if (tabId) this.switchMainTab(tabId);
      });
    });

    // Mini Battle HUD Quick Return Click
    if (this.dom.btnMiniReturnBattle) {
      this.dom.btnMiniReturnBattle.addEventListener('click', () => {
        this.switchMainTab('tab-battle');
      });
    }

    if (this.dom.miniBattleHud) {
      this.dom.miniBattleHud.addEventListener('click', (e) => {
        if (e.target !== this.dom.btnMiniReturnBattle) {
          this.switchMainTab('tab-battle');
        }
      });
    }

    // Sub-Tabs Nav in Forge and Ascend
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parentPanel = btn.closest('.panel');
        if (!parentPanel) return;
        parentPanel.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
        parentPanel.querySelectorAll('.sub-tab-view').forEach(v => v.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.subview);
        if (target) target.classList.add('active');
        if (btn.dataset.subview === 'view-achievements-list') {
          this.renderAchievementsView();
        } else if (btn.dataset.subview === 'view-crucible-merge' || btn.dataset.subview === 'view-forge-upgrade') {
          this.renderForgeView();
        } else if (btn.dataset.subview === 'view-shop-merchant') {
          this.renderShopView();
        }
      });
    });

    // Options Menu (Sound Channels, Simulation Speed, Analytics, Save)
    if (this.dom.btnOptionsMenu) {
      this.dom.btnOptionsMenu.addEventListener('click', () => {
        this.openOptionsMenu();
      });
    }

    // Auto-Push checkbox
    this.dom.chkAutoPush.checked = !!this.state.autoPush;
    this.dom.chkAutoPush.addEventListener('change', (e) => {
      this.state.autoPush = e.target.checked;
      this.addLog(`[AUTO-PUSH] Recovery auto-push: <strong>${this.state.autoPush ? 'ENABLED' : 'DISABLED'}</strong>.`, 'log-system');
    });

    // Push Mode Toggle
    this.dom.btnTogglePush.addEventListener('click', () => {
      this.combat.toggleCombatMode();
      this.renderArena();
    });

    // Stage Navigation
    this.dom.btnPrevStage.addEventListener('click', () => {
      if (this.state.stage > 1) {
        this.combat.setGrindStage(this.state.stage - 1);
        this.renderArena();
      }
    });

    this.dom.btnNextStage.addEventListener('click', () => {
      if (this.state.stage < this.state.maxStage) {
        this.combat.setGrindStage(this.state.stage + 1);
        this.renderArena();
      }
    });

    // Free Respec
    this.dom.btnRespec.addEventListener('click', () => {
      const refunded = this.stats.respecAttributes();
      this.sound.playLevelUp();
      this.addLog(`[RESPEC] Free attribute refund applied! (${refunded} AP returned).`, 'log-system');
      this.renderHeroPanel();
      this.renderSkillsBar();
    });

    const btnHeroGrimoire = document.getElementById('btn-hero-grimoire');
    if (btnHeroGrimoire) {
      btnHeroGrimoire.addEventListener('click', () => {
        this.openSkillsModal();
      });
    }

    // AP Step Multiplier Selector
    document.querySelectorAll('.btn-ap-step').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-ap-step').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.apStep = btn.dataset.step;
        this.renderHeroPanel();
      });
    });

    // Stats Tab Switching
    document.querySelectorAll('.stat-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.stat-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.stat-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
      });
    });

    // Quick Salvage & Merge Junk
    if (this.dom.btnSalvageAll) {
      this.dom.btnSalvageAll.addEventListener('click', () => {
        this.shop.salvageUnusedItems();
        this.renderEquipmentView();
      });
    }

    if (this.dom.btnMergeJunk) {
      this.dom.btnMergeJunk.addEventListener('click', () => {
        this.shop.mergeAllJunk();
        this.renderEquipmentView();
        this.renderForgeView();
        this.renderHeroPanel();
      });
    }

    // Crucible Actions
    if (this.dom.btnCrucibleAutofill) {
      this.dom.btnCrucibleAutofill.addEventListener('click', () => {
        this.shop.fillCrucibleWithJunk();
        this.renderForgeView();
      });
    }

    if (this.dom.btnCrucibleClear) {
      this.dom.btnCrucibleClear.addEventListener('click', () => {
        this.shop.clearCrucible();
        this.renderForgeView();
      });
    }

    if (this.dom.btnCrucibleFuse) {
      this.dom.btnCrucibleFuse.addEventListener('click', () => {
        const fused = this.shop.fuseCrucibleItems();
        if (fused) {
          this.renderEquipmentView();
          this.renderForgeView();
          this.renderHeroPanel();
        }
      });
    }

    // Shop Refresh
    if (this.dom.btnRefreshShop) {
      this.dom.btnRefreshShop.addEventListener('click', () => {
        this.shop.refreshShopStock();
        this.renderShopView();
        this.renderHeader();
      });
    }

    // Delegated Shop Buy Clicks
    if (this.dom.shopItemsList) {
      this.dom.shopItemsList.addEventListener('click', (e) => {
        const card = e.target.closest('.shop-card');
        if (!card) return;
        const buyBtn = card.querySelector('.btn-buy');
        if (buyBtn && buyBtn.disabled) return;

        const idx = parseInt(card.dataset.shopIdx, 10);
        if (!isNaN(idx) && this.shop.buyShopItem(idx)) {
          if (this.dom.itemTooltip) {
            this.dom.itemTooltip.classList.add('hidden');
          }
          this.renderShopView();
          this.renderEquipmentView();
          this.renderHeroPanel();
          this.renderHeader();
        }
      });
    }

    // Forge Actions
    this.dom.btnForgeEnhance.addEventListener('click', () => {
      this.shop.enhanceItem();
      this.renderForgeView();
      this.renderEquipmentView();
      this.renderHeroPanel();
    });

    this.dom.btnForgeReforge.addEventListener('click', () => {
      this.shop.reforgeAffixes();
      this.renderForgeView();
      this.renderEquipmentView();
      this.renderHeroPanel();
    });

    this.dom.btnForgeSalvage.addEventListener('click', () => {
      this.shop.salvageSelectedItem();
      this.renderForgeView();
      this.renderEquipmentView();
    });

    // Ascension Button
    this.dom.btnPerformAscend.addEventListener('click', () => {
      if (confirm('Are you sure you want to Ascend? Your Level, Gold, and Stage will reset to 1 in exchange for permanent Ancient Shards!')) {
        const success = this.meta.performAscension();
        if (success) {
          this.combat.stageKills = 0;
          this.combat.init();
          if (this.shop) this.shop.refreshShopStock(true);
          if (this.dom.chkAutoPush) this.dom.chkAutoPush.checked = false;
          this.renderAll();
          this.switchMainTab('tab-battle');
        }
      }
    });

    // Clear Log
    this.dom.btnClearLog.addEventListener('click', () => {
      this.dom.combatLog.innerHTML = '';
    });

    // Modal Close
    this.dom.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.dom.modalOverlay) {
        this.closeModal();
      }
    });
  }

  // Keyboard Shortcuts Hook
  bindHotkeys() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger hotkeys if typing in textarea or input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === 'p') {
        this.combat.toggleCombatMode();
        this.renderArena();
      } else if (['1', '2', '3', '4', '5'].includes(key)) {
        const slotIdx = parseInt(key, 10) - 1;
        const equipped = this.skills ? this.skills.getEquippedSkills() : [];
        if (equipped[slotIdx]) {
          this.skills.castSkill(equipped[slotIdx].id);
          this.renderSkillsBar();
        }
      } else if (key === 'r') {
        this.stats.respecAttributes();
        this.renderHeroPanel();
        this.renderSkillsBar();
      } else if (key === 's') {
        this.shop.salvageUnusedItems();
        this.renderEquipmentView();
      } else if (e.code === 'Space') {
        e.preventDefault();
        const speeds = [0.33, 0.66, 1.0, 2.0];
        const nextIdx = ((speeds.indexOf(window.gameSpeed || 0.33) + 1) % speeds.length);
        window.gameSpeed = speeds[nextIdx];
        this.addLog(`[SPEED] Game simulation set to ${window.gameSpeed}x.`, 'log-system');
      }
    });
  }

  // Master Render
  renderAll() {
    this.renderHeader();
    this.renderHeroPanel();
    this.renderArena();
    this.renderSkillsBar();
    this.renderEquipmentView();
    this.renderShopView();
    this.renderForgeView();
    this.renderAscensionView();
    this.renderAchievementsView();
  }

  // Header Resources
  renderHeader() {
    this.dom.goldDisplay.textContent = this.formatNumber(this.state.gold);
    this.dom.shardsDisplay.textContent = this.formatNumber(this.state.shards || 0);
    const derived = this.stats.getDerivedStats();
    this.dom.dpsDisplay.textContent = this.formatNumber(derived.totalDps);
  }

  // Helper: Get matching hero sprite based on build archetype or ascension
  getHeroSprite() {
    const archetype = this.stats.getArchetypeTitle();
    if (this.state.ascensions > 0) {
      return HERO_SPRITES.ASCENDED;
    }
    if (archetype.includes('Berserker') || archetype.includes('Warrior')) {
      return HERO_SPRITES.BERSERKER;
    }
    if (archetype.includes('Assassin') || archetype.includes('Viper')) {
      return HERO_SPRITES.ASSASSIN;
    }
    if (archetype.includes('Guardian') || archetype.includes('Juggernaut')) {
      return HERO_SPRITES.PALADIN;
    }
    if (archetype.includes('Duelist') || archetype.includes('Ranger')) {
      return HERO_SPRITES.RANGER;
    }
    if (archetype.includes('Mage') || archetype.includes('Sage')) {
      return HERO_SPRITES.MAGE;
    }
    return HERO_SPRITES.NOVICE;
  }

  // Left Panel: Hero, Attributes, Derived Stats
  renderHeroPanel() {
    const hero = this.state.hero;
    const derived = this.stats.getDerivedStats();
    const archetype = this.stats.getArchetypeTitle();

    this.dom.heroLevel.textContent = hero.level;
    this.dom.heroArchetypeTag.textContent = archetype;

    // Dynamic Pixel Art Avatar based on Archetype & Ascension
    const heroSprite = this.getHeroSprite();
    this.dom.heroAvatar.innerHTML = renderFighterSprite(heroSprite, 54);

    // Bars
    this.dom.heroHpText.textContent = `${this.formatNumber(Math.round(hero.currentHp))} / ${this.formatNumber(derived.maxHp)}`;
    const hpPct = Math.max(0, Math.min(100, (hero.currentHp / derived.maxHp) * 100));
    this.dom.heroHpFill.style.width = `${hpPct}%`;

    this.dom.heroXpText.textContent = `${this.formatNumber(hero.xp)} / ${this.formatNumber(hero.xpToNext)}`;
    const xpPct = Math.max(0, Math.min(100, (hero.xp / hero.xpToNext) * 100));
    this.dom.heroXpFill.style.width = `${xpPct}%`;

    // Available AP & Mobile Badge Update
    this.dom.unspentAp.textContent = hero.unspentAp;
    if (this.dom.navApBadge) {
      if (hero.unspentAp > 0) {
        this.dom.navApBadge.textContent = hero.unspentAp;
        this.dom.navApBadge.classList.remove('hidden');
      } else {
        this.dom.navApBadge.classList.add('hidden');
      }
    }

    // Calculate Allocation Amount
    let allocAmount = 1;
    if (this.apStep === 'max') {
      allocAmount = Math.max(1, hero.unspentAp);
    } else {
      allocAmount = Math.min(hero.unspentAp, parseInt(this.apStep, 10));
    }
    const stepButtonText = this.apStep === 'max' ? 'Max' : `+${this.apStep}`;

    // Render Attribute Rows
    const attrDefs = [
      { key: 'str', name: 'Strength (STR)', desc: '+Physical Damage & Armor' },
      { key: 'dex', name: 'Dexterity (DEX)', desc: '+Attack Speed & Critical Hit Rate' },
      { key: 'agi', name: 'Agility (AGI)', desc: '+Multi-Strike & Evasion/Dodge' },
      { key: 'int', name: 'Intelligence (INT)', desc: '+Poison & DoT Multipliers, Gold Find' },
      { key: 'vit', name: 'Vitality (VIT)', desc: '+Max HP & Health Regeneration' },
      { key: 'end', name: 'Endurance (END)', desc: '+Damage Reduction, Block & Thorns' }
    ];

    let html = '';
    for (const attr of attrDefs) {
      const val = hero.attributes[attr.key] || 0;
      const canAdd = hero.unspentAp > 0;
      html += `
        <div class="attrib-row">
          <div class="attrib-info">
            <span class="attrib-name">${attr.name}</span>
            <span class="attrib-desc">${attr.desc}</span>
          </div>
          <div class="attrib-controls">
            <span class="attrib-val">${val}</span>
            <button class="btn-add-stat" data-attr="${attr.key}" ${canAdd ? '' : 'disabled'}>${stepButtonText}</button>
          </div>
        </div>
      `;
    }
    this.dom.attributeRows.innerHTML = html;

    // Bind Add Point Buttons
    this.dom.attributeRows.querySelectorAll('.btn-add-stat').forEach(btn => {
      btn.addEventListener('click', () => {
        const attrKey = btn.dataset.attr;
        const ptsToAllocate = this.apStep === 'max' ? this.state.hero.unspentAp : Math.min(this.state.hero.unspentAp, parseInt(this.apStep, 10));
        if (this.stats.allocateAttribute(attrKey, ptsToAllocate)) {
          this.sound.playGold();
          this.renderHeroPanel();
          this.renderHeader();
        }
      });
    });

    // Derived Stats Update
    this.dom.statAtk.textContent = this.formatNumber(derived.atk);
    this.dom.statAps.textContent = `${derived.aps} /s`;
    this.dom.statCritChance.textContent = `${derived.critChance}%`;
    this.dom.statCritMult.textContent = `${derived.critMult}%`;
    this.dom.statMultiStrike.textContent = `${derived.multiStrike}%`;
    this.dom.statArmorPen.textContent = `${derived.armorPen}%`;
    this.dom.statPoison.textContent = `${this.formatNumber(derived.poisonDmg)} Dmg/s (${derived.poisonChance}%)`;
    this.dom.statBleed.textContent = `${derived.bleed}%`;

    this.dom.statMaxHp.textContent = this.formatNumber(derived.maxHp);
    this.dom.statArmor.textContent = this.formatNumber(derived.armor);
    this.dom.statDr.textContent = `${derived.dr}%`;
    this.dom.statDodge.textContent = `${derived.dodge}%`;
    this.dom.statBlock.textContent = `${derived.block}%`;
    this.dom.statThorns.textContent = `${this.formatNumber(derived.thorns)} Dmg`;
    this.dom.statLifeSteal.textContent = `${derived.lifeSteal}%`;
    this.dom.statRegen.textContent = `${derived.hpRegen} HP/s`;

    this.dom.statGoldFind.textContent = `+${derived.goldFind}%`;
    this.dom.statXpBonus.textContent = `+${derived.xpBoost}%`;
    this.dom.statLuck.textContent = `+${derived.luck}%`;
    this.dom.statTickSpeed.textContent = `${window.gameSpeed || 0.33}x`;
  }

  // Center Arena
  renderArena() {
    const stage = this.state.stage;
    const biome = this.combat.getBiomeForStage(stage);
    const isBoss = this.combat.isBossStage(stage);
    const enemy = this.combat.currentEnemy;
    const derived = this.stats.getDerivedStats();

    this.dom.zoneName.textContent = biome.name;
    this.dom.biomeIcon.innerHTML = renderItemIcon(biome.sprite, 32);
    this.dom.currentStageNum.textContent = stage;
    this.dom.stageSelectLabel.textContent = `Stage ${stage}`;

    this.dom.bossIndicator.classList.toggle('hidden', !isBoss);

    // Stage Nav buttons
    this.dom.btnPrevStage.disabled = (stage <= 1);
    this.dom.btnNextStage.disabled = (stage >= this.state.maxStage);

    // Biome Environment Styling & Props
    if (this.dom.battlefieldContainer && (this.dom.battlefieldContainer.dataset.biome !== biome.id || !this.dom.biomeProps?.hasChildNodes())) {
      this.dom.battlefieldContainer.dataset.biome = biome.id;
      this.renderBiomeProps(biome.id);
    }

    // Push vs Grind mode button styling
    const isPushing = this.state.combatMode === 'pushing';
    this.dom.btnTogglePush.classList.toggle('pushing-active', isPushing);
    this.dom.btnTogglePush.textContent = isPushing ? 'PUSHING [ACTIVE]' : 'START PUSH';
    this.dom.modeStatusText.textContent = isPushing ? 'Progression Mode (Pushing)' : 'Grinding Mode (Safe Farm)';
    this.dom.modeSubText.textContent = isPushing ? 'Challenging higher stages! Hero falls back upon defeat.' : `Farming Stage ${stage} safely without death penalty.`;

    // Hero Arena Sprite
    const heroSprite = this.getHeroSprite();
    if (this.dom.heroSprite) {
      this.dom.heroSprite.innerHTML = renderFighterSprite(heroSprite, 92);
    }

    // Hero HP Bar
    const heroHpPct = Math.max(0, Math.min(100, (this.state.hero.currentHp / derived.maxHp) * 100));
    this.dom.arenaHeroHp.style.width = `${heroHpPct}%`;

    // Update Persistent Mini Battle HUD
    if (this.dom.miniZoneName) this.dom.miniZoneName.textContent = biome.name;
    if (this.dom.miniStageNum) this.dom.miniStageNum.textContent = stage;
    if (this.dom.miniModeTag) this.dom.miniModeTag.textContent = isPushing ? '[PUSH]' : '[FARM]';
    if (this.dom.miniHeroHpFill) this.dom.miniHeroHpFill.style.width = `${heroHpPct}%`;

    // Hero Buff Status Tray
    let heroBuffHtml = '';
    if (this.skills) {
      if (this.skills.hasBuff('bladeFlurry')) heroBuffHtml += `<div class="status-badge status-bleed">${renderItemIcon({ r: 3, c: 4 }, 14)} FLURRY</div>`;
      if (this.skills.hasBuff('bloodFeast')) heroBuffHtml += `<div class="status-badge status-burn">${renderItemIcon({ r: 1, c: 0 }, 14)} FEAST</div>`;
      if (this.skills.hasBuff('ironBastion')) heroBuffHtml += `<div class="status-badge status-poison">${renderItemIcon({ r: 3, c: 7 }, 14)} BASTION</div>`;
    }
    this.dom.heroStatusTray.innerHTML = heroBuffHtml;

    // Enemy Render
    if (enemy) {
      this.dom.enemyName.textContent = enemy.name;
      this.dom.enemySprite.innerHTML = renderFighterSprite(enemy, enemy.isBoss ? 112 : 88);
      const enemyHpPct = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));
      this.dom.arenaEnemyHp.style.width = `${enemyHpPct}%`;
      if (this.dom.miniEnemyHpFill) this.dom.miniEnemyHpFill.style.width = `${enemyHpPct}%`;

      // Status Trays
      let statusHtml = '';
      if (enemy.statusEffects && enemy.statusEffects.poison.stacks > 0) {
        statusHtml += `<div class="status-badge status-poison">${renderItemIcon({ r: 0, c: 1 }, 14)} ${enemy.statusEffects.poison.stacks}x POISON</div>`;
      }
      this.dom.enemyStatusTray.innerHTML = statusHtml;
    }

    // Metrics
    this.dom.arenaKillsCount.textContent = isPushing ? `Stage ${this.state.stage} [Push]` : `Stage ${this.state.stage} [Farm]`;
    this.dom.arenaKpm.textContent = `${this.combat.killsLastMinute} / min`;
    this.dom.arenaGpm.textContent = `+${this.formatNumber(this.combat.goldLastMinute)} G/m`;
    this.dom.arenaXpm.textContent = `+${this.formatNumber(this.combat.xpLastMinute)} XP/m`;
  }

  // Render Active Skills Bar
  renderSkillsBar() {
    if (!this.skills || !this.dom.skillsBar) return;

    const maxSlots = this.skills.getMaxSlots();
    const equipped = this.skills.getEquippedSkills();

    let html = `
      <div class="skills-bar-header">
        <div class="skills-bar-title">ACTIVE ATTACKS [${equipped.length}/${maxSlots} SLOTS]</div>
        <button id="btn-open-grimoire" class="btn btn-sm btn-grimoire" title="View all stat-scaled attacks & loadout grimoire">
          <svg class="pixel-svg" width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 1h10v2H3V1zm-2 2h14v10H1V3zm2 2v6h10V5H3z"/>
          </svg>
          GRIMOIRE
        </button>
      </div>
      <div class="skills-slots-track">
    `;

    for (let i = 0; i < 5; i++) {
      const slotLevelReq = SKILL_SLOT_LEVELS[i]?.level || 1;
      const isUnlockedSlot = i < maxSlots;
      const skill = isUnlockedSlot ? equipped[i] : null;

      if (isUnlockedSlot && skill) {
        const cd = this.state.skills.cooldowns[skill.id] || 0;
        const cdPct = (cd / skill.cooldown) * 100;
        const isAuto = !!this.state.skills.autoCast[skill.id];

        html += `
          <div class="skill-btn-card ${cd > 0 ? 'on-cooldown' : ''}" data-skill-id="${skill.id}" data-slot-idx="${i}" title="${skill.desc}">
            <div class="skill-slot-tag">[${i + 1}]</div>
            <div class="skill-cooldown-fill" style="height: ${cdPct}%;"></div>
            <div class="skill-info-group">
              <span class="skill-icon">${renderItemIcon(skill.sprite, 24)}</span>
              <span class="skill-name">${skill.name}</span>
            </div>
            <div class="skill-card-controls">
              <span class="skill-autocast-pill active" title="Attacks are always auto-cast on cooldown">
                AUTO
              </span>
              <button class="skill-swap-pill" data-swap-slot="${i}" title="Swap equipped attack in Grimoire">
                SWAP
              </button>
            </div>
          </div>
        `;
      } else if (isUnlockedSlot && !skill) {
        html += `
          <div class="skill-slot-empty" data-open-slot="${i}" title="Equip an attack to this slot">
            <div class="skill-slot-tag">[${i + 1}]</div>
            <div class="slot-empty-icon">+</div>
            <div class="slot-empty-text">EQUIP</div>
          </div>
        `;
      } else {
        html += `
          <div class="skill-slot-locked" title="Unlocked at Hero Level ${slotLevelReq}">
            <div class="skill-slot-tag">[${i + 1}]</div>
            <div class="slot-locked-icon">
              <svg class="pixel-svg" width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 6V4a4 4 0 0 1 8 0v2h1v9H3V6h1zm2 0h4V4a2 2 0 0 0-4 0v2z"/>
              </svg>
            </div>
            <div class="slot-locked-text">LV ${slotLevelReq}</div>
          </div>
        `;
      }
    }

    html += `</div>`;
    this.dom.skillsBar.innerHTML = html;

    // Cast skill click (manual trigger override if off cooldown)
    this.dom.skillsBar.querySelectorAll('.skill-btn-card').forEach(card => {
      const skillId = card.dataset.skillId;
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('skill-swap-pill')) return;
        this.skills.castSkill(skillId);
        this.renderSkillsBar();
      });
    });

    // Swap / open slot grimoire
    this.dom.skillsBar.querySelectorAll('.skill-swap-pill, .skill-slot-empty').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const slotIdx = parseInt(el.dataset.swapSlot ?? el.dataset.openSlot, 10);
        this.openSkillsModal(slotIdx);
      });
    });

    // Open Grimoire
    const btnGrimoire = document.getElementById('btn-open-grimoire');
    if (btnGrimoire) {
      btnGrimoire.addEventListener('click', () => {
        this.openSkillsModal();
      });
    }
  }

  // Attack Grimoire & Active Loadout Modal
  openSkillsModal(selectedSlot = 0) {
    if (!this.skills) return;

    const maxSlots = this.skills.getMaxSlots();
    const equipped = this.skills.getEquippedSkills();
    const heroLevel = (this.state && this.state.hero && this.state.hero.level) || 1;
    const attrs = (this.state && this.state.hero && this.state.hero.attributes) || {};

    let currentCategoryFilter = 'ALL';

    const renderModalBody = () => {
      // 1. Slots Loadout Bar in Modal
      let slotsHtml = '';
      for (let i = 0; i < 5; i++) {
        const isUnlocked = i < maxSlots;
        const skill = isUnlocked ? equipped[i] : null;
        const reqLvl = SKILL_SLOT_LEVELS[i]?.level || 1;
        const isTarget = i === selectedSlot;

        if (isUnlocked && skill) {
          slotsHtml += `
            <div class="modal-slot-card ${isTarget ? 'selected' : ''}" data-slot-idx="${i}">
              <div class="modal-slot-label">SLOT ${i + 1}</div>
              <div class="modal-slot-icon">${renderItemIcon(skill.sprite, 24)}</div>
              <div class="modal-slot-name">${skill.name}</div>
              <button class="btn-slot-unequip" data-unequip-idx="${i}" title="Unequip attack">X</button>
            </div>
          `;
        } else if (isUnlocked && !skill) {
          slotsHtml += `
            <div class="modal-slot-card empty ${isTarget ? 'selected' : ''}" data-slot-idx="${i}">
              <div class="modal-slot-label">SLOT ${i + 1}</div>
              <div class="modal-slot-empty-plus">+</div>
              <div class="modal-slot-empty-txt">SELECT</div>
            </div>
          `;
        } else {
          slotsHtml += `
            <div class="modal-slot-card locked" title="Unlocks at Hero Level ${reqLvl}">
              <div class="modal-slot-label">SLOT ${i + 1}</div>
              <div class="modal-slot-locked-txt">LOCKED</div>
              <div class="modal-slot-lvl">LV ${reqLvl}</div>
            </div>
          `;
        }
      }

      // 2. Filtered Skills List
      let skillsListHtml = '';
      const filteredSkills = currentCategoryFilter === 'ALL' 
        ? ACTIVE_SKILLS 
        : ACTIVE_SKILLS.filter(s => s.category.toUpperCase() === currentCategoryFilter.toUpperCase());

      for (const skill of filteredSkills) {
        const isUnlocked = this.skills.isSkillUnlocked(skill);
        const isEquipped = equipped.some(s => s.id === skill.id);
        const equippedSlotIdx = equipped.findIndex(s => s.id === skill.id);

        // Req readout
        let reqHtml = '';
        if (!skill.req || Object.keys(skill.req).length === 0) {
          reqHtml = `<span class="skill-req-badge universal">UNIVERSAL (NO STAT REQ)</span>`;
        } else {
          const reqParts = [];
          for (const [attrKey, reqVal] of Object.entries(skill.req)) {
            const current = attrs[attrKey] || 0;
            const met = current >= reqVal;
            const diff = reqVal - current;
            reqParts.push(`
              <span class="skill-req-chip ${met ? 'met' : 'unmet'}">
                ${attrKey.toUpperCase()}: ${reqVal} (${met ? 'OK' : `+${diff}`})
              </span>
            `);
          }
          reqHtml = reqParts.join(' ');
        }

        let actionBtnHtml = '';
        if (isEquipped) {
          actionBtnHtml = `<span class="badge-equipped-tag">[SLOT ${equippedSlotIdx + 1}]</span>`;
        } else if (isUnlocked) {
          actionBtnHtml = `
            <button class="btn btn-primary btn-sm btn-action-equip" data-equip-id="${skill.id}">
              EQUIP [SLOT ${selectedSlot + 1}]
            </button>
          `;
        } else {
          actionBtnHtml = `<span class="badge-locked-tag">STAT LOCKED</span>`;
        }

        skillsListHtml += `
          <div class="grimoire-skill-card ${isUnlocked ? 'unlocked' : 'locked'} ${isEquipped ? 'equipped' : ''}">
            <div class="grimoire-skill-icon-box">
              ${renderItemIcon(skill.sprite, 28)}
              <span class="grimoire-category-tag">${skill.category}</span>
            </div>
            <div class="grimoire-skill-details">
              <div class="grimoire-skill-header">
                <span class="grimoire-skill-name">${skill.name}</span>
                <span class="grimoire-cooldown-tag">${skill.cooldown}s CD</span>
              </div>
              <div class="grimoire-req-row">${reqHtml}</div>
              <div class="grimoire-skill-desc">${skill.desc}</div>
            </div>
            <div class="grimoire-skill-actions">
              ${actionBtnHtml}
            </div>
          </div>
        `;
      }

      this.dom.modalContent.innerHTML = `
        <div class="options-modal-header">
          <div class="options-modal-title">
            <svg class="pixel-svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 1h10v2H3V1zm-2 2h14v10H1V3zm2 2v6h10V5H3z"/>
            </svg>
            ATTACK GRIMOIRE & LOADOUT
          </div>
          <button id="btn-grimoire-x-close" class="modal-x-btn" title="Close">X</button>
        </div>

        <div class="options-modal-body grimoire-modal-body">
          <!-- Level & Slot Progression Bar -->
          <div class="grimoire-progression-card">
            <div class="progression-title-row">
              <span>ACTIVE ATTACK SLOTS: <strong>${equipped.length} / ${maxSlots}</strong></span>
              <span>HERO LEVEL: <strong>${heroLevel}</strong></span>
            </div>
            <div class="modal-slots-row">
              ${slotsHtml}
            </div>
          </div>

          <!-- Stat Distribution Readout -->
          <div class="grimoire-stat-row">
            <div class="grimoire-stat-chip">STR: <strong>${attrs.str || 0}</strong></div>
            <div class="grimoire-stat-chip">DEX: <strong>${attrs.dex || 0}</strong></div>
            <div class="grimoire-stat-chip">AGI: <strong>${attrs.agi || 0}</strong></div>
            <div class="grimoire-stat-chip">INT: <strong>${attrs.int || 0}</strong></div>
            <div class="grimoire-stat-chip">VIT: <strong>${attrs.vit || 0}</strong></div>
            <div class="grimoire-stat-chip">END: <strong>${attrs.end || 0}</strong></div>
          </div>

          <!-- Category Filter Bar -->
          <div class="grimoire-filter-bar">
            ${['ALL', 'Strength', 'Dexterity', 'Agility', 'Intelligence', 'Vitality', 'Endurance', 'Hybrid'].map(cat => `
              <button class="btn btn-sm btn-filter-grimoire ${currentCategoryFilter.toUpperCase() === cat.toUpperCase() ? 'active' : ''}" data-cat="${cat}">
                ${cat.toUpperCase()}
              </button>
            `).join('')}
          </div>

          <!-- Skills Catalog -->
          <div class="grimoire-skills-list">
            ${skillsListHtml}
          </div>
        </div>

        <div class="options-modal-footer">
          <button id="btn-grimoire-close" class="btn btn-primary btn-sm">Done</button>
        </div>
      `;

      this.dom.modalOverlay.classList.remove('hidden');

      // Bind slot clicks to switch target slot
      this.dom.modalContent.querySelectorAll('.modal-slot-card:not(.locked)').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.classList.contains('btn-slot-unequip')) return;
          selectedSlot = parseInt(card.dataset.slotIdx, 10);
          renderModalBody();
        });
      });

      // Bind unequip clicks
      this.dom.modalContent.querySelectorAll('.btn-slot-unequip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const unequipIdx = parseInt(btn.dataset.unequipIdx, 10);
          this.skills.unequipSkill(unequipIdx);
          this.renderSkillsBar();
          renderModalBody();
        });
      });

      // Bind category filter clicks
      this.dom.modalContent.querySelectorAll('.btn-filter-grimoire').forEach(btn => {
        btn.addEventListener('click', () => {
          currentCategoryFilter = btn.dataset.cat;
          renderModalBody();
        });
      });

      // Bind equip action clicks
      this.dom.modalContent.querySelectorAll('.btn-action-equip').forEach(btn => {
        btn.addEventListener('click', () => {
          const equipId = btn.dataset.equipId;
          const success = this.skills.equipSkill(equipId, selectedSlot);
          if (success) {
            this.sound.playEquip();
            this.renderSkillsBar();
            if (selectedSlot + 1 < maxSlots) {
              selectedSlot += 1;
            }
            renderModalBody();
          }
        });
      });

      // Close handlers
      const closeHandler = () => {
        this.closeModal();
        this.renderSkillsBar();
      };
      const btnClose = document.getElementById('btn-grimoire-close');
      if (btnClose) btnClose.addEventListener('click', closeHandler);
      const btnX = document.getElementById('btn-grimoire-x-close');
      if (btnX) btnX.addEventListener('click', closeHandler);
    };

    renderModalBody();
  }

  // Helper to clear drag highlight styling across the UI
  clearDragDropHighlights() {
    document.querySelectorAll('.gear-slot, .inv-slot, .catalyst-slot').forEach(el => {
      el.classList.remove('dragging', 'valid-drop-target', 'invalid-drop-target', 'drag-hover');
    });
  }

  // Right Panel: Gear Slots & Inventory with Drag and Drop
  renderEquipmentView() {
    const slots = [
      { key: 'mainHand', label: 'Main Hand' },
      { key: 'offHand', label: 'Off Hand' },
      { key: 'helmet', label: 'Helmet' },
      { key: 'chest', label: 'Chest Armor' },
      { key: 'boots', label: 'Boots' },
      { key: 'ring1', label: 'Ring 1' },
      { key: 'ring2', label: 'Ring 2' },
      { key: 'amulet', label: 'Amulet' }
    ];

    let slotsHtml = '';
    for (const slot of slots) {
      const item = this.state.equipment[slot.key];
      if (item) {
        const rarityClass = `rarity-${item.rarity}`;
        slotsHtml += `
          <div class="gear-slot filled ${rarityClass}" data-slot="${slot.key}" draggable="true">
            <div class="gear-slot-icon">${renderItemIcon(item, 36)}</div>
            <div class="gear-slot-label">${slot.label}</div>
            ${item.level > 0 ? `<div class="item-enhancement-badge">+${item.level}</div>` : ''}
          </div>
        `;
      } else {
        slotsHtml += `
          <div class="gear-slot empty" data-slot="${slot.key}">
            <div class="gear-slot-icon" style="opacity: 0.35;">${renderItemIcon({ type: slot.key }, 36)}</div>
            <div class="gear-slot-label">${slot.label}</div>
          </div>
        `;
      }
    }
    this.dom.gearSlots.innerHTML = slotsHtml;

    // Gear Slot Event Listeners & Drag Handling
    this.dom.gearSlots.querySelectorAll('.gear-slot').forEach(slotEl => {
      const slotKey = slotEl.dataset.slot;
      const item = this.state.equipment[slotKey];

      if (item) {
        this.bindItemHover(slotEl, item);

        // Click to forge / upgrade
        slotEl.addEventListener('click', () => {
          this.shop.selectItemForForge(item, { type: 'equip', indexOrSlot: slotKey });
          this.renderForgeView();
          this.switchMainTab('tab-shop');
          const subBtn = document.querySelector('[data-subview="view-forge-upgrade"]');
          if (subBtn) subBtn.click();
        });

        // Right-click to unequip
        slotEl.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.shop.unequipItem(slotKey);
          this.renderEquipmentView();
          this.renderHeroPanel();
        });

        // Drag start from equipped slot
        slotEl.addEventListener('dragstart', (e) => {
          this.draggedItemInfo = { source: 'equip', slotKey, item };
          slotEl.classList.add('dragging');
          this.hideTooltip();

          e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'equip', slotKey }));
          e.dataTransfer.effectAllowed = 'move';

          // Highlight other compatible gear slots and inventory
          this.dom.gearSlots.querySelectorAll('.gear-slot').forEach(otherSlotEl => {
            const otherKey = otherSlotEl.dataset.slot;
            if (otherKey !== slotKey && this.shop.isSlotCompatible(item, otherKey)) {
              otherSlotEl.classList.add('valid-drop-target');
            }
          });
          this.dom.inventoryGrid.querySelectorAll('.inv-slot').forEach(invEl => {
            invEl.classList.add('valid-drop-target');
          });
        });

        slotEl.addEventListener('dragend', () => {
          this.draggedItemInfo = null;
          this.clearDragDropHighlights();
        });
      }

      // Drag over gear slot target
      slotEl.addEventListener('dragover', (e) => {
        if (!this.draggedItemInfo) return;
        const dragged = this.draggedItemInfo;

        const isCompatible = this.shop.isSlotCompatible(dragged.item, slotKey);
        if (isCompatible && (dragged.source === 'inv' || dragged.slotKey !== slotKey)) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          slotEl.classList.add('drag-hover');
        }
      });

      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('drag-hover');
      });

      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('drag-hover');
        if (!this.draggedItemInfo) return;

        const dragged = this.draggedItemInfo;
        if (dragged.source === 'inv') {
          if (this.shop.isSlotCompatible(dragged.item, slotKey)) {
            this.shop.equipItem(dragged.index, slotKey);
            this.renderEquipmentView();
            this.renderHeroPanel();
          }
        } else if (dragged.source === 'equip' && dragged.slotKey !== slotKey) {
          if (this.shop.swapEquipmentSlots(dragged.slotKey, slotKey)) {
            this.renderEquipmentView();
            this.renderHeroPanel();
          }
        }
        this.draggedItemInfo = null;
        this.clearDragDropHighlights();
      });
    });

    // Render Inventory
    this.dom.invCount.textContent = this.state.inventory.length;
    if (this.dom.navInvBadge) {
      const invLen = this.state.inventory.length;
      if (invLen >= 20) {
        this.dom.navInvBadge.textContent = `${invLen}/24`;
        this.dom.navInvBadge.classList.remove('hidden');
      } else {
        this.dom.navInvBadge.classList.add('hidden');
      }
    }
    let invHtml = '';
    for (let i = 0; i < 24; i++) {
      const item = this.state.inventory[i];
      if (item) {
        const rarityClass = `rarity-${item.rarity}`;
        invHtml += `
          <div class="inv-slot ${rarityClass}" data-index="${i}" draggable="true">
            ${renderItemIcon(item, 32)}
            ${item.level > 0 ? `<div class="item-enhancement-badge">+${item.level}</div>` : ''}
          </div>
        `;
      } else {
        invHtml += `<div class="inv-slot empty" data-index="${i}"></div>`;
      }
    }
    this.dom.inventoryGrid.innerHTML = invHtml;

    // Inventory Slots Event Listeners & Drag Handling
    this.dom.inventoryGrid.querySelectorAll('.inv-slot').forEach(slotEl => {
      const idx = parseInt(slotEl.dataset.index, 10);
      const item = this.state.inventory[idx];

      if (item) {
        this.bindItemHover(slotEl, item);

        // Click interaction
        slotEl.addEventListener('click', () => {
          const shopActive = (document.getElementById('tab-shop') && document.getElementById('tab-shop').classList.contains('active')) ||
                             (document.getElementById('tab-forge') && document.getElementById('tab-forge').classList.contains('active'));
          if (shopActive) {
            const isUpgradeView = document.getElementById('view-forge-upgrade') && document.getElementById('view-forge-upgrade').classList.contains('active');
            if (isUpgradeView) {
              this.shop.selectItemForForge(item, { type: 'inv', indexOrSlot: idx });
              this.renderForgeView();
            } else {
              this.shop.addToCrucible(idx);
              this.renderForgeView();
            }
          } else {
            this.shop.equipItem(idx);
            this.renderEquipmentView();
            this.renderHeroPanel();
          }
        });

        // Right click interaction
        slotEl.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const shopActive = (document.getElementById('tab-shop') && document.getElementById('tab-shop').classList.contains('active')) ||
                             (document.getElementById('tab-forge') && document.getElementById('tab-forge').classList.contains('active'));
          if (shopActive) {
            const isUpgradeView = document.getElementById('view-forge-upgrade') && document.getElementById('view-forge-upgrade').classList.contains('active');
            if (isUpgradeView) {
              this.shop.selectItemForForge(item, { type: 'inv', indexOrSlot: idx });
              this.renderForgeView();
            } else {
              this.shop.addToCrucible(idx);
              this.renderForgeView();
            }
          } else {
            this.shop.selectItemForForge(item, { type: 'inv', indexOrSlot: idx });
            this.renderForgeView();
            this.switchMainTab('tab-shop');
            const subBtn = document.querySelector('[data-subview="view-forge-upgrade"]');
            if (subBtn) subBtn.click();
          }
        });

        // Drag start from inventory
        slotEl.addEventListener('dragstart', (e) => {
          this.draggedItemInfo = { source: 'inv', index: idx, item };
          slotEl.classList.add('dragging');
          this.hideTooltip();

          e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'inv', index: idx }));
          e.dataTransfer.effectAllowed = 'move';

          // Highlight compatible equipment slots
          this.dom.gearSlots.querySelectorAll('.gear-slot').forEach(gearEl => {
            const gearKey = gearEl.dataset.slot;
            if (this.shop.isSlotCompatible(item, gearKey)) {
              gearEl.classList.add('valid-drop-target');
            } else {
              gearEl.classList.add('invalid-drop-target');
            }
          });

          // Highlight crucible slots if present
          if (this.dom.crucibleSlotsContainer) {
            this.dom.crucibleSlotsContainer.querySelectorAll('.catalyst-slot').forEach(catEl => {
              catEl.classList.add('valid-drop-target');
            });
          }
        });

        slotEl.addEventListener('dragend', () => {
          this.draggedItemInfo = null;
          this.clearDragDropHighlights();
        });
      }

      // Drop target on inventory slot (both filled and empty)
      slotEl.addEventListener('dragover', (e) => {
        if (!this.draggedItemInfo) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        slotEl.classList.add('drag-hover');
      });

      slotEl.addEventListener('dragleave', () => {
        slotEl.classList.remove('drag-hover');
      });

      slotEl.addEventListener('drop', (e) => {
        e.preventDefault();
        slotEl.classList.remove('drag-hover');
        if (!this.draggedItemInfo) return;

        const dragged = this.draggedItemInfo;
        if (dragged.source === 'inv') {
          if (dragged.index !== idx) {
            this.shop.swapInventorySlots(dragged.index, idx);
            this.renderEquipmentView();
          }
        } else if (dragged.source === 'equip') {
          this.shop.unequipItem(dragged.slotKey, idx);
          this.renderEquipmentView();
          this.renderHeroPanel();
        }
        this.draggedItemInfo = null;
        this.clearDragDropHighlights();
      });
    });
  }

  // Shop View
  renderShopView() {
    if (!this.dom.shopItemsList) return;
    if (this.dom.shopRefreshCost) {
      this.dom.shopRefreshCost.textContent = this.shop.getRefreshCost();
    }
    
    let html = '';
    const stock = this.state.shopStock || [];

    if (stock.length === 0) {
      this.dom.shopItemsList.innerHTML = `
        <div style="text-align: center; padding: 24px 12px; color: #8892b0; font-size: 8px;">
          All items sold out! Click RESTOCK above to roll new merchant gear.
        </div>
      `;
      return;
    }

    for (let i = 0; i < stock.length; i++) {
      const item = stock[i];
      const rarityDef = RARITIES[item.rarity.toUpperCase()] || RARITIES.COMMON;
      const canAfford = (this.state.gold || 0) >= item.price;

      let statsSummary = [];
      if (item.baseAtk) statsSummary.push(`+${item.baseAtk} ATK`);
      if (item.baseAps) statsSummary.push(`${item.baseAps} APS`);
      if (item.baseHp) statsSummary.push(`+${item.baseHp} HP`);
      if (item.baseArmor) statsSummary.push(`+${item.baseArmor} Armor`);
      if (item.affixes && item.affixes.length > 0) statsSummary.push(`+${item.affixes.length} Affixes`);

      html += `
        <div class="shop-card rarity-${item.rarity}" data-shop-idx="${i}">
          <div class="shop-item-meta">
            <div class="shop-item-icon">${renderItemIcon(item, 40)}</div>
            <div class="shop-item-info">
              <span class="shop-item-name" style="color: ${rarityDef.color}">${item.name}</span>
              <span class="shop-item-stats">${statsSummary.join(' • ')}</span>
            </div>
          </div>
          <button class="btn-buy" data-buy-idx="${i}" ${canAfford ? '' : 'disabled'}>
            ${this.formatNumber(item.price)} GOLD
          </button>
        </div>
      `;
    }

    this.dom.shopItemsList.innerHTML = html;

    this.dom.shopItemsList.querySelectorAll('.shop-card').forEach(card => {
      const idx = parseInt(card.dataset.shopIdx, 10);
      const item = stock[idx];
      if (item) this.bindItemHover(card, item);

      card.addEventListener('click', (e) => {
        const buyBtn = card.querySelector('.btn-buy');
        if (buyBtn && buyBtn.disabled) return;
        if (!isNaN(idx) && this.shop.buyShopItem(idx)) {
          if (this.dom.itemTooltip) {
            this.dom.itemTooltip.classList.add('hidden');
          }
          this.renderShopView();
          this.renderEquipmentView();
          this.renderHeroPanel();
          this.renderHeader();
        }
      });
    });
  }

  // The Forge View (Fusion Crucible + Item Enhancer & Reforger)
  renderForgeView() {
    // 1. Render Crucible Slots
    if (this.dom.crucibleSlotsContainer) {
      let crucibleHtml = '';
      for (let i = 0; i < 5; i++) {
        const slotData = this.shop.crucibleSlots[i];
        if (slotData && slotData.item) {
          const item = slotData.item;
          const rarityDef = RARITIES[item.rarity.toUpperCase()] || RARITIES.COMMON;
          crucibleHtml += `
            <div class="catalyst-slot filled rarity-${item.rarity}" data-crucible-idx="${i}" title="${item.name} (Click to remove)">
              <div class="catalyst-icon">${renderItemIcon(item, 34)}</div>
              <div class="catalyst-name" style="color: ${rarityDef.color}">${item.name}</div>
              <button class="btn-remove-catalyst" data-remove-idx="${i}" title="Remove item">✕</button>
            </div>
          `;
        } else {
          crucibleHtml += `
            <div class="catalyst-slot empty" data-crucible-idx="${i}" title="Empty Catalyst Slot (Click any item below to add)">
              <div class="empty-plus">+</div>
              <div class="empty-label">CATALYST ${i + 1}</div>
            </div>
          `;
        }
      }
      this.dom.crucibleSlotsContainer.innerHTML = crucibleHtml;

      // Bind remove clicks on catalyst items
      this.dom.crucibleSlotsContainer.querySelectorAll('.btn-remove-catalyst').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.removeIdx, 10);
          this.shop.removeFromCrucible(idx);
          this.renderForgeView();
        });
      });

      // Bind tooltips and drag/drop on catalyst slots
      this.dom.crucibleSlotsContainer.querySelectorAll('.catalyst-slot').forEach(slotEl => {
        const idx = parseInt(slotEl.dataset.crucibleIdx, 10);
        const slotData = this.shop.crucibleSlots[idx];
        if (slotData) this.bindItemHover(slotEl, slotData.item);

        slotEl.addEventListener('dragover', (e) => {
          if (this.draggedItemInfo && this.draggedItemInfo.source === 'inv') {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            slotEl.classList.add('drag-hover');
          }
        });

        slotEl.addEventListener('dragleave', () => {
          slotEl.classList.remove('drag-hover');
        });

        slotEl.addEventListener('drop', (e) => {
          e.preventDefault();
          slotEl.classList.remove('drag-hover');
          if (this.draggedItemInfo && this.draggedItemInfo.source === 'inv') {
            this.shop.addToCrucible(this.draggedItemInfo.index);
            this.renderForgeView();
            this.renderEquipmentView();
          }
          this.draggedItemInfo = null;
          this.clearDragDropHighlights();
        });
      });
    }

    // 2. Calculate and render real-time Crucible Odds
    const odds = this.shop.calculateCrucibleOdds();
    if (odds && odds.count >= 2) {
      const p = odds.probabilities;
      const countMult = (1.0 + (odds.count - 2) * 0.45).toFixed(2);
      if (this.dom.crucibleMultTag) {
        this.dom.crucibleMultTag.textContent = `${odds.count} CATALYSTS (${countMult}x POWER MULT)`;
        this.dom.crucibleMultTag.className = 'odds-mult-badge active';
      }

      if (this.dom.oddsBreakdownBar) {
        let barHtml = '';
        if (p.common > 0) barHtml += `<div class="odds-bar-segment seg-common" style="width: ${p.common}%;">${p.common}%</div>`;
        if (p.uncommon > 0) barHtml += `<div class="odds-bar-segment seg-uncommon" style="width: ${p.uncommon}%;">${p.uncommon}%</div>`;
        if (p.rare > 0) barHtml += `<div class="odds-bar-segment seg-rare" style="width: ${p.rare}%;">${p.rare}%</div>`;
        if (p.epic > 0) barHtml += `<div class="odds-bar-segment seg-epic" style="width: ${p.epic}%;">${p.epic}%</div>`;
        if (p.legendary > 0) barHtml += `<div class="odds-bar-segment seg-legendary" style="width: ${p.legendary}%;">${p.legendary}%</div>`;
        if (p.mythic > 0) barHtml += `<div class="odds-bar-segment seg-mythic" style="width: ${p.mythic}%;">${p.mythic}%</div>`;
        this.dom.oddsBreakdownBar.innerHTML = barHtml;
      }

      if (this.dom.oddPctUncommon) this.dom.oddPctUncommon.textContent = `${p.uncommon}%`;
      if (this.dom.oddPctRare) this.dom.oddPctRare.textContent = `${p.rare}%`;
      if (this.dom.oddPctEpic) this.dom.oddPctEpic.textContent = `${p.epic}%`;
      if (this.dom.oddPctLegendary) this.dom.oddPctLegendary.textContent = `${p.legendary}%`;
      if (this.dom.oddPctMythic) this.dom.oddPctMythic.textContent = `${p.mythic}%`;
      if (this.dom.oddPctTier) this.dom.oddPctTier.textContent = `${odds.tierUpChance}%`;

      if (this.dom.btnCrucibleFuse) {
        this.dom.btnCrucibleFuse.disabled = false;
        this.dom.btnCrucibleFuse.textContent = `[ TRANSMUTE ${odds.count} CATALYSTS ]`;
      }
    } else {
      if (this.dom.crucibleMultTag) {
        this.dom.crucibleMultTag.textContent = '2-5 CATALYSTS REQUIRED';
        this.dom.crucibleMultTag.className = 'odds-mult-badge';
      }
      if (this.dom.oddsBreakdownBar) {
        this.dom.oddsBreakdownBar.innerHTML = `<div class="odds-bar-segment seg-common" style="width: 100%;">INSERT ITEMS TO CALCULATE ODDS</div>`;
      }
      if (this.dom.oddPctUncommon) this.dom.oddPctUncommon.textContent = '0%';
      if (this.dom.oddPctRare) this.dom.oddPctRare.textContent = '0%';
      if (this.dom.oddPctEpic) this.dom.oddPctEpic.textContent = '0%';
      if (this.dom.oddPctLegendary) this.dom.oddPctLegendary.textContent = '0%';
      if (this.dom.oddPctMythic) this.dom.oddPctMythic.textContent = '0%';
      if (this.dom.oddPctTier) this.dom.oddPctTier.textContent = '0%';

      if (this.dom.btnCrucibleFuse) {
        this.dom.btnCrucibleFuse.disabled = true;
        this.dom.btnCrucibleFuse.textContent = '[ TRANSMUTE CATALYSTS ]';
      }
    }

    // 3. Render Crucible Backpack Quick-Selector
    if (this.dom.crucibleBackpackGrid) {
      let bpGridHtml = '';
      for (let i = 0; i < 24; i++) {
        const item = this.state.inventory[i];
        if (item) {
          const inCrucible = this.shop.crucibleSlots.some(s => s.invIndex === i);
          const rarityClass = `rarity-${item.rarity}`;
          bpGridHtml += `
            <div class="inv-slot ${rarityClass} ${inCrucible ? 'in-crucible' : ''}" data-bp-index="${i}" draggable="true" title="${item.name} (Click to ${inCrucible ? 'remove from' : 'add to'} Crucible)">
              ${renderItemIcon(item, 32)}
              ${item.level > 0 ? `<div class="item-enhancement-badge">+${item.level}</div>` : ''}
              ${inCrucible ? `<div class="crucible-in-tag">CATALYST</div>` : ''}
            </div>
          `;
        } else {
          bpGridHtml += `<div class="inv-slot empty" data-bp-index="${i}"></div>`;
        }
      }
      this.dom.crucibleBackpackGrid.innerHTML = bpGridHtml;

      this.dom.crucibleBackpackGrid.querySelectorAll('.inv-slot').forEach(slotEl => {
        const idx = parseInt(slotEl.dataset.bpIndex, 10);
        const item = this.state.inventory[idx];
        if (item) {
          this.bindItemHover(slotEl, item);

          slotEl.addEventListener('click', () => {
            this.shop.addToCrucible(idx);
            this.renderForgeView();
          });

          slotEl.addEventListener('dragstart', (e) => {
            this.draggedItemInfo = { source: 'inv', index: idx, item };
            e.dataTransfer.setData('text/plain', JSON.stringify({ source: 'inv', index: idx }));
            e.dataTransfer.effectAllowed = 'copy';
          });
        }
      });
    }

    // 4. Render Enhancement Anvil Active Slot
    const item = this.shop.selectedForgeItem;
    if (!item) {
      this.dom.forgeItemPreview.innerHTML = `<div class="empty-forge-msg">Select any equipped or backpack item below to enhance (+1) or reforge affixes.</div>`;
      this.dom.forgeActions.style.display = 'none';
    } else {
      const rarityDef = RARITIES[item.rarity.toUpperCase()] || RARITIES.COMMON;
      const enhanceCost = this.shop.getEnhanceCost(item);
      const enhanceRate = this.shop.getEnhanceSuccessRate(item);
      const reforgeCost = this.shop.getReforgeCost(item);
      const salvageYield = this.shop.getSalvageYield(item);

      let affixesHtml = '';
      for (const a of item.affixes) {
        affixesHtml += `<div class="tooltip-affix">• ${a.name}: +${a.val}${a.unit || ''}</div>`;
      }

      this.dom.forgeItemPreview.innerHTML = `
        <div style="margin-bottom: 8px; display: flex; justify-content: center;">${renderItemIcon(item, 56)}</div>
        <div style="font-size: 15px; font-weight: 800; color: ${rarityDef.color}">${item.name} ${item.level > 0 ? `(+${item.level})` : ''}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">Tier ${item.tier} • ${rarityDef.name} ${item.type}</div>
        <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">
          ${item.baseAtk ? `Base ATK: ${item.baseAtk} ` : ''}
          ${item.baseHp ? `Base HP: ${item.baseHp} ` : ''}
          ${item.baseArmor ? `Base Armor: ${item.baseArmor} ` : ''}
        </div>
        <div style="font-size: 11px;">${affixesHtml}</div>
      `;

      this.dom.forgeActions.style.display = 'flex';
      this.dom.forgeEnhanceCost.textContent = `Cost: ${this.formatNumber(enhanceCost)} Gold (${enhanceRate}% Rate)`;
      this.dom.forgeReforgeCost.textContent = `Cost: ${this.formatNumber(reforgeCost)} Gold`;
      this.dom.forgeSalvageYield.textContent = `Yield: +${this.formatNumber(salvageYield)} Gold`;
    }

    // 5. Render Upgrade Item Picker Grid (Equipped + Backpack)
    if (this.dom.upgradeGearPicker) {
      let upgradePickerHtml = `
        <div class="upgrade-picker-subgroup">
          <div class="upgrade-picker-sublabel">EQUIPPED GEAR</div>
          <div class="upgrade-gear-row">
      `;
      for (const [slotKey, slotDef] of Object.entries(ITEM_TYPES)) {
        const eqItem = this.state.equipment[slotKey];
        if (eqItem) {
          const isSelected = this.shop.selectedForgeItem === eqItem;
          const rarityClass = `rarity-${eqItem.rarity}`;
          upgradePickerHtml += `
            <div class="inv-slot ${rarityClass} ${isSelected ? 'selected-forge' : ''}" data-forge-type="equip" data-forge-key="${slotKey}" title="${eqItem.name} (Equipped)">
              ${renderItemIcon(eqItem, 32)}
              ${eqItem.level > 0 ? `<div class="item-enhancement-badge">+${eqItem.level}</div>` : ''}
            </div>
          `;
        } else {
          upgradePickerHtml += `
            <div class="inv-slot empty" title="Empty ${slotDef.name}"></div>
          `;
        }
      }
      upgradePickerHtml += `
          </div>
        </div>
        <div class="upgrade-picker-subgroup" style="margin-top: 8px;">
          <div class="upgrade-picker-sublabel">BACKPACK ITEMS</div>
          <div class="inventory-grid">
      `;
      for (let i = 0; i < 24; i++) {
        const bpItem = this.state.inventory[i];
        if (bpItem) {
          const isSelected = this.shop.selectedForgeItem === bpItem;
          const rarityClass = `rarity-${bpItem.rarity}`;
          upgradePickerHtml += `
            <div class="inv-slot ${rarityClass} ${isSelected ? 'selected-forge' : ''}" data-forge-type="inv" data-forge-key="${i}" title="${bpItem.name}">
              ${renderItemIcon(bpItem, 32)}
              ${bpItem.level > 0 ? `<div class="item-enhancement-badge">+${bpItem.level}</div>` : ''}
            </div>
          `;
        } else {
          upgradePickerHtml += `<div class="inv-slot empty"></div>`;
        }
      }
      upgradePickerHtml += `
          </div>
        </div>
      `;
      this.dom.upgradeGearPicker.innerHTML = upgradePickerHtml;

      this.dom.upgradeGearPicker.querySelectorAll('.inv-slot[data-forge-type]').forEach(slotEl => {
        const fType = slotEl.dataset.forgeType;
        const fKey = slotEl.dataset.forgeKey;
        const itemObj = fType === 'equip' ? this.state.equipment[fKey] : this.state.inventory[parseInt(fKey, 10)];
        if (itemObj) {
          this.bindItemHover(slotEl, itemObj);
          slotEl.addEventListener('click', () => {
            this.shop.selectItemForForge(itemObj, { type: fType, indexOrSlot: fType === 'equip' ? fKey : parseInt(fKey, 10) });
            this.renderForgeView();
          });
        }
      });
    }
  }

  // Ascension View
  renderAscensionView() {
    const maxStage = this.state.maxStage || 1;
    const pendingShards = this.meta.getPendingShards();
    const canAscend = this.meta.canAscend();

    this.dom.ascendMaxStage.textContent = `Stage ${maxStage}`;
    this.dom.ascendPendingShards.textContent = `+${pendingShards} SHARDS`;

    if (this.dom.navAscendBadge) {
      this.dom.navAscendBadge.classList.toggle('hidden', !canAscend);
    }

    if (canAscend) {
      this.dom.ascendReqText.textContent = '[THRESHOLD MET: STAGE 25+]';
      this.dom.ascendReqText.className = 'text-success';
      this.dom.btnPerformAscend.disabled = false;
    } else {
      this.dom.ascendReqText.textContent = '[STAGE 25 REQUIRED]';
      this.dom.ascendReqText.className = 'text-warning';
      this.dom.btnPerformAscend.disabled = true;
    }

    let relicsHtml = '';
    for (const relicDef of RELICS) {
      const currentRank = this.state.relics[relicDef.id] || 0;
      const cost = this.meta.getRelicCost(relicDef);
      const isMax = currentRank >= relicDef.maxRank;
      const canAfford = (this.state.shards || 0) >= cost;

      relicsHtml += `
        <div class="relic-card">
          <div class="relic-icon-wrap" style="margin-right: 10px; display: flex; align-items: center; flex-shrink: 0;">
            ${renderItemIcon(relicDef.sprite, 36)}
          </div>
          <div class="relic-info">
            <span class="relic-name">${relicDef.name} (Rank ${currentRank}/${relicDef.maxRank})</span>
            <span class="relic-desc">${relicDef.desc}</span>
          </div>
          <button class="btn-relic-buy" data-relic-id="${relicDef.id}" ${isMax || !canAfford ? 'disabled' : ''}>
            ${isMax ? 'MAX' : `${cost} SHARDS`}
          </button>
        </div>
      `;
    }
    this.dom.relicsList.innerHTML = relicsHtml;

    this.dom.relicsList.querySelectorAll('.btn-relic-buy').forEach(btn => {
      btn.addEventListener('click', () => {
        const relicId = btn.dataset.relicId;
        if (this.meta.upgradeRelic(relicId)) {
          this.renderAscensionView();
          this.renderHeroPanel();
          this.renderHeader();
        }
      });
    });
  }

  // Render Achievements View
  renderAchievementsView() {
    if (!this.achievements || !this.dom.achievementsList) return;

    const unlocked = this.state.unlockedAchievements || {};
    let html = '';

    for (const ach of ACHIEVEMENTS) {
      const isUnlocked = !!unlocked[ach.id];
      html += `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : ''}">
          <div class="achievement-icon" style="display: flex; align-items: center; justify-content: center;">
            ${renderItemIcon(ach.sprite, 36)}
          </div>
          <div class="achievement-info">
            <span class="achievement-title">${ach.name}</span>
            <span class="achievement-desc">${ach.desc}</span>
            <span class="achievement-reward">Reward: ${ach.rewardDesc}</span>
          </div>
          <span class="achievement-status-badge ${isUnlocked ? 'unlocked' : 'locked'}">
            ${isUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
      `;
    }
    this.dom.achievementsList.innerHTML = html;
  }

  // Item Hover Tooltip Builder
  bindItemHover(element, item) {
    if (!item) return;

    element.addEventListener('mouseenter', () => {
      const rarityDef = RARITIES[item.rarity.toUpperCase()] || RARITIES.COMMON;
      let affixesHtml = '';
      if (item.affixes) {
        for (const a of item.affixes) {
          affixesHtml += `<div class="tooltip-affix">• ${a.name}: +${a.val}${a.unit || ''}</div>`;
        }
      }

      this.dom.itemTooltip.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          ${renderItemIcon(item, 32)}
          <div>
            <div class="tooltip-title" style="color: ${rarityDef.color}">${item.name} ${item.level > 0 ? `(+${item.level})` : ''}</div>
            <div class="tooltip-type">Tier ${item.tier} • ${rarityDef.name} ${item.type}</div>
          </div>
        </div>
        <div class="tooltip-stats">
          ${item.baseAtk ? `<div>Attack Damage: <strong>+${item.baseAtk}</strong></div>` : ''}
          ${item.baseAps ? `<div>Attack Speed: <strong>${item.baseAps} /s</strong></div>` : ''}
          ${item.baseHp ? `<div>Max Health: <strong>+${item.baseHp}</strong></div>` : ''}
          ${item.baseArmor ? `<div>Armor: <strong>+${item.baseArmor}</strong></div>` : ''}
          ${item.baseBlock ? `<div>Block Chance: <strong>+${item.baseBlock}%</strong></div>` : ''}
          ${item.baseDodge ? `<div>Evasion / Dodge: <strong>+${item.baseDodge}%</strong></div>` : ''}
        </div>
        ${affixesHtml ? `<div style="margin-top: 6px; border-top: 1px solid #1e293b; padding-top: 4px;">${affixesHtml}</div>` : ''}
        <div style="margin-top: 6px; font-size: 10px; color: #f59e0b;">Value: ${this.formatNumber(item.price)} Gold</div>
      `;
      this.dom.itemTooltip.classList.remove('hidden');
    });

    element.addEventListener('mousemove', (e) => {
      const pad = 15;
      let left = e.clientX + pad;
      let top = e.clientY + pad;

      if (left + 280 > window.innerWidth) left = e.clientX - 290;
      if (top + 220 > window.innerHeight) top = e.clientY - 230;

      this.dom.itemTooltip.style.left = `${left}px`;
      this.dom.itemTooltip.style.top = `${top}px`;
    });

    element.addEventListener('mouseleave', () => {
      this.dom.itemTooltip.classList.add('hidden');
    });
  }

  // Floating Combat Damage Splat
  spawnDamageSplat(text, type, target, isMultiStrike = false) {
    const splat = document.createElement('div');
    splat.className = `damage-splat splat-${type}`;
    
    // Formatting / Prefix
    if (type === 'crit') {
      splat.innerHTML = `<span style="font-size: 8px; color: #f97316; margin-right: 2px;">CRIT</span>${text}!`;
    } else {
      splat.textContent = text;
    }

    const layer = this.dom.damageSplatLayer;
    if (!layer) return;
    const isHero = target === 'hero';

    const targetEl = isHero ? (this.dom.heroSprite || this.dom.arenaHero) : (this.dom.enemySprite || this.dom.arenaEnemy);
    let baseX = isHero ? layer.clientWidth * 0.25 : layer.clientWidth * 0.75;
    let baseY = layer.clientHeight * 0.45;

    if (targetEl && layer) {
      const targetRect = targetEl.getBoundingClientRect();
      const layerRect = layer.getBoundingClientRect();
      if (targetRect.width > 0 && layerRect.width > 0) {
        baseX = targetRect.left - layerRect.left + (targetRect.width / 2);
        baseY = targetRect.top - layerRect.top + (targetRect.height * 0.15);
      }
    }

    const randomOffsetX = (Math.random() - 0.5) * 32 + (isMultiStrike ? 20 : 0);
    const randomOffsetY = (Math.random() - 0.5) * 16;

    splat.style.left = `${Math.max(10, Math.min(layer.clientWidth - 70, baseX + randomOffsetX - 20))}px`;
    splat.style.top = `${baseY + randomOffsetY}px`;

    layer.appendChild(splat);
    setTimeout(() => {
      splat.remove();
    }, 950);
  }

  // Screen Trauma / Shake Engine
  triggerScreenShake(intensity = 'hit') {
    const container = document.getElementById('battlefield-container');
    if (!container) return;

    const shakeClass = intensity === 'heavy' 
      ? 'screen-shake-heavy' 
      : (intensity === 'crit' ? 'screen-shake-crit' : 'screen-shake-hit');

    container.classList.remove('screen-shake-hit', 'screen-shake-crit', 'screen-shake-heavy');
    void container.offsetWidth; // Force reflow
    container.classList.add(shakeClass);

    const duration = intensity === 'heavy' ? 400 : (intensity === 'crit' ? 280 : 160);
    setTimeout(() => {
      if (container) container.classList.remove(shakeClass);
    }, duration);
  }

  triggerHeroAttackVisual() {
    if (!this.dom.arenaHero) return;
    this.dom.arenaHero.classList.remove('attack-lunge-hero');
    void this.dom.arenaHero.offsetWidth; // Reflow to restart animation
    this.dom.arenaHero.classList.add('attack-lunge-hero');
    setTimeout(() => {
      if (this.dom.arenaHero) this.dom.arenaHero.classList.remove('attack-lunge-hero');
    }, 200);
  }

  triggerEnemyAttackVisual() {
    if (!this.dom.arenaEnemy) return;
    this.dom.arenaEnemy.classList.remove('attack-lunge-enemy');
    void this.dom.arenaEnemy.offsetWidth;
    this.dom.arenaEnemy.classList.add('attack-lunge-enemy');
    setTimeout(() => {
      if (this.dom.arenaEnemy) this.dom.arenaEnemy.classList.remove('attack-lunge-enemy');
    }, 200);
  }

  triggerEnemyHit(isCrit = false) {
    if (!this.dom.enemySprite) return;
    const animClass = isCrit ? 'hit-flash-crit' : 'hit-flash-normal';
    this.dom.enemySprite.classList.remove('hit-flash-normal', 'hit-flash-crit', 'hit-flash-poison', 'hit-flash-bleed');
    void this.dom.enemySprite.offsetWidth;
    this.dom.enemySprite.classList.add(animClass);

    this.triggerScreenShake(isCrit ? 'crit' : 'hit');

    setTimeout(() => {
      if (this.dom.enemySprite) this.dom.enemySprite.classList.remove(animClass);
    }, isCrit ? 280 : 200);
  }

  triggerHeroHit(isCrit = false) {
    if (!this.dom.heroSprite) return;
    const animClass = isCrit ? 'hit-flash-crit' : 'hit-flash-normal';
    this.dom.heroSprite.classList.remove('hit-flash-normal', 'hit-flash-crit');
    void this.dom.heroSprite.offsetWidth;
    this.dom.heroSprite.classList.add(animClass);

    this.triggerScreenShake(isCrit ? 'crit' : 'hit');

    setTimeout(() => {
      if (this.dom.heroSprite) this.dom.heroSprite.classList.remove(animClass);
    }, 200);
  }

  triggerPoisonVisual(target = 'enemy') {
    const el = target === 'hero' ? this.dom.heroSprite : this.dom.enemySprite;
    if (!el) return;
    el.classList.remove('hit-flash-poison');
    void el.offsetWidth;
    el.classList.add('hit-flash-poison');
    setTimeout(() => {
      if (el) el.classList.remove('hit-flash-poison');
    }, 250);
  }

  triggerBleedVisual(target = 'enemy') {
    const el = target === 'hero' ? this.dom.heroSprite : this.dom.enemySprite;
    if (!el) return;
    el.classList.remove('hit-flash-bleed');
    void el.offsetWidth;
    el.classList.add('hit-flash-bleed');
    setTimeout(() => {
      if (el) el.classList.remove('hit-flash-bleed');
    }, 250);
  }

  triggerEnemyDefeatVisual() {
    if (!this.dom.enemySprite) return;
    this.dom.enemySprite.classList.add('death-dissolve');
    this.triggerScreenShake('hit');
    setTimeout(() => {
      if (this.dom.enemySprite) this.dom.enemySprite.classList.remove('death-dissolve');
    }, 400);
  }

  // Render atmospheric pixel props for each distinct environment
  renderBiomeProps(biomeId) {
    if (!this.dom.biomeProps) return;
    switch (biomeId) {
      case 'forest':
        this.dom.biomeProps.innerHTML = `
          <div class="prop-forest-moon"></div>
          <div class="prop-forest-trees"></div>
          <div class="prop-mushroom-cluster left"></div>
          <div class="prop-mushroom-cluster right"></div>
          <div class="prop-hanging-vines"></div>
        `;
        break;
      case 'catacombs':
        this.dom.biomeProps.innerHTML = `
          <div class="prop-dungeon-arches"></div>
          <div class="prop-torch torch-left"><div class="pixel-torch-flame"></div></div>
          <div class="prop-torch torch-right"><div class="pixel-torch-flame"></div></div>
          <div class="prop-dungeon-chains left"></div>
          <div class="prop-dungeon-chains right"></div>
        `;
        break;
      case 'crag':
        this.dom.biomeProps.innerHTML = `
          <div class="prop-crag-stalactites"></div>
          <div class="prop-lava-falls left"></div>
          <div class="prop-lava-falls right"></div>
          <div class="prop-magma-vent left"></div>
          <div class="prop-magma-vent right"></div>
        `;
        break;
      case 'citadel':
        this.dom.biomeProps.innerHTML = `
          <div class="prop-aurora-borealis"></div>
          <div class="prop-castle-battlements"></div>
          <div class="prop-ice-spires left"></div>
          <div class="prop-ice-spires right"></div>
        `;
        break;
      case 'abyss':
        this.dom.biomeProps.innerHTML = `
          <div class="prop-void-nebula"></div>
          <div class="prop-void-monolith left"><div class="void-glyph"></div></div>
          <div class="prop-void-monolith right"><div class="void-glyph"></div></div>
          <div class="prop-astral-rift"></div>
        `;
        break;
      case 'sanctum':
        this.dom.biomeProps.innerHTML = `
          <div class="prop-celestial-godrays"></div>
          <div class="prop-pantheon-column left"></div>
          <div class="prop-pantheon-column right"></div>
          <div class="prop-golden-arch"></div>
        `;
        break;
      default:
        this.dom.biomeProps.innerHTML = '';
        break;
    }
  }

  // Stage Transition sequence: Hero exits right -> Fade to black -> Load new stage -> Fade in & Entrances
  triggerStageTransition(onLoadNewStage, onComplete) {
    const heroEl = this.dom.arenaHero;
    const enemyEl = this.dom.arenaEnemy;
    const overlayEl = this.dom.arenaFadeOverlay || document.getElementById('arena-fade-overlay');

    // 1. Hero walks off stage right
    if (heroEl) {
      heroEl.classList.remove('hero-entering', 'hero-walking-off');
      void heroEl.offsetWidth;
      heroEl.classList.add('hero-walking-off');
    }

    // 2. Fade to black as hero exits the screen
    setTimeout(() => {
      if (overlayEl) {
        overlayEl.classList.add('faded-black');
      }
    }, 280);

    // 3. While blacked out: update stage, biome scenery, and position new entities
    setTimeout(() => {
      if (heroEl) {
        heroEl.classList.remove('hero-walking-off');
      }
      if (enemyEl) {
        enemyEl.classList.remove('enemy-entering');
      }

      if (typeof onLoadNewStage === 'function') {
        onLoadNewStage();
      }

      // Trigger entrance animations
      if (heroEl) {
        void heroEl.offsetWidth;
        heroEl.classList.add('hero-entering');
      }
      if (enemyEl) {
        void enemyEl.offsetWidth;
        enemyEl.classList.add('enemy-entering');
      }

      // 4. Fade back in from black
      if (overlayEl) {
        overlayEl.classList.remove('faded-black');
      }
    }, 550);

    // 5. Complete transition and restore normal combat
    setTimeout(() => {
      if (heroEl) heroEl.classList.remove('hero-entering');
      if (enemyEl) enemyEl.classList.remove('enemy-entering');
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 1100);
  }

  // Add Log Entry
  addLog(html, className = 'log-entry') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${className}`;
    entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${html}`;
    this.dom.combatLog.prepend(entry);

    if (this.dom.combatLog.children.length > 50) {
      this.dom.combatLog.lastElementChild.remove();
    }
  }

  // Unified Options & System Settings Modal
  openOptionsMenu() {
    const derived = this.stats ? this.stats.getDerivedStats() : { totalDps: 0 };
    const tracker = (this.state && this.state.statsTracker) || {};
    const sfxPct = this.sound ? Math.round(this.sound.sfxVolume * 100) : 70;
    const bgmPct = this.sound ? Math.round(this.sound.bgmVolume * 100) : 40;
    const sfxEn = this.sound ? this.sound.sfxEnabled : true;
    const bgmEn = this.sound ? this.sound.bgmEnabled : true;
    const currentSpeed = window.gameSpeed || 1.0;

    this.dom.modalContent.innerHTML = `
      <div class="options-modal-header">
        <div class="options-modal-title">
          <svg class="pixel-svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 0h4v2H6V0zm0 14h4v2H6v-2zM0 6h2v4H0V6zm14 0h2v4h-2V6zM2 2h3v2H2V2zm9 0h3v2h-3V2zM2 11h3v2H2v-2zm9 0h3v2h-3v-2zM4 4h8v8H4V4zm2 2v4h4V6H6z"/>
          </svg>
          SYSTEM OPTIONS & AUDIO
        </div>
        <button id="btn-options-x-close" class="modal-x-btn" title="Close">X</button>
      </div>

      <div class="options-modal-body">
        <!-- AUDIO CHANNELS -->
        <div class="options-section">
          <div class="options-sec-title">AUDIO CHANNELS</div>
          
          <!-- SFX Channel -->
          <div class="audio-control-card">
            <div class="audio-card-header">
              <label class="pixel-toggle-label">
                <input type="checkbox" id="chk-sfx-toggle" ${sfxEn ? 'checked' : ''}>
                <span class="audio-channel-name">SOUND EFFECTS (SFX)</span>
              </label>
              <span id="sfx-vol-val" class="vol-pct-text">${sfxEn ? sfxPct + '%' : 'MUTED'}</span>
            </div>
            <div class="slider-wrapper">
              <input type="range" id="slider-sfx-vol" class="pixel-slider" min="0" max="100" value="${sfxPct}">
            </div>
          </div>

          <!-- BGM Channel -->
          <div class="audio-control-card">
            <div class="audio-card-header">
              <label class="pixel-toggle-label">
                <input type="checkbox" id="chk-bgm-toggle" ${bgmEn ? 'checked' : ''}>
                <span class="audio-channel-name">BACKGROUND MUSIC (BGM)</span>
              </label>
              <span id="bgm-vol-val" class="vol-pct-text">${bgmEn ? bgmPct + '%' : 'MUTED'}</span>
            </div>
            <div class="slider-wrapper">
              <input type="range" id="slider-bgm-vol" class="pixel-slider" min="0" max="100" value="${bgmPct}">
            </div>
          </div>
        </div>

        <!-- SIMULATION SPEED -->
        <div class="options-section">
          <div class="options-sec-title">GAME SIMULATION SPEED</div>
          <div class="speed-selector-group">
            <button class="btn btn-sm btn-speed-select ${currentSpeed === 0.33 ? 'active' : ''}" data-speed="0.33">0.33x NORMAL</button>
            <button class="btn btn-sm btn-speed-select ${currentSpeed === 0.66 ? 'active' : ''}" data-speed="0.66">0.66x FAST</button>
            <button class="btn btn-sm btn-speed-select ${currentSpeed === 1.0 ? 'active' : ''}" data-speed="1.0">1.0x TURBO</button>
            <button class="btn btn-sm btn-speed-select ${currentSpeed === 2.0 ? 'active' : ''}" data-speed="2.0">2.0x HYPER</button>
          </div>
        </div>

        <!-- COMBAT ANALYTICS & STATS -->
        <div class="options-section">
          <div class="options-sec-title">COMBAT ANALYTICS & MILESTONES</div>
          <div class="options-metrics-grid">
            <div class="opt-metric-box">
              <div class="opt-metric-lbl">ESTIMATED DPS</div>
              <div class="opt-metric-num" style="color: #a5b4fc;">${this.formatNumber(derived.totalDps)}</div>
            </div>
            <div class="opt-metric-box">
              <div class="opt-metric-lbl">TOTAL KILLS</div>
              <div class="opt-metric-num" style="color: #fde047;">${this.formatNumber(tracker.totalKills || 0)}</div>
            </div>
            <div class="opt-metric-box">
              <div class="opt-metric-lbl">LIFETIME GOLD</div>
              <div class="opt-metric-num" style="color: #f59e0b;">${this.formatNumber(tracker.totalGoldEarned || 0)} G</div>
            </div>
            <div class="opt-metric-box">
              <div class="opt-metric-lbl">PEAK POISON</div>
              <div class="opt-metric-num" style="color: #34d399;">${tracker.highestPoisonStacks || 0}x</div>
            </div>
            <div class="opt-metric-box">
              <div class="opt-metric-lbl">ASCENSIONS</div>
              <div class="opt-metric-num" style="color: #c084fc;">${(this.state && this.state.ascensions) || 0}</div>
            </div>
            <div class="opt-metric-box">
              <div class="opt-metric-lbl">RELICS UNLOCKED</div>
              <div class="opt-metric-num" style="color: #38bdf8;">${Object.keys((this.state && this.state.relics) || {}).length} / ${Object.keys(RELICS).length}</div>
            </div>
          </div>

          <div class="hotkeys-summary-box">
            <div class="hotkeys-title">KEYBOARD SHORTCUTS:</div>
            <div class="hotkeys-grid">
              <div><kbd>P</kbd> Push/Grind</div>
              <div><kbd>1 - 4</kbd> Active Skills</div>
              <div><kbd>R</kbd> Free Respec</div>
              <div><kbd>S</kbd> Quick Salvage</div>
              <div><kbd>Space</kbd> Cycle Speed</div>
            </div>
          </div>
        </div>

        <!-- SAVE MANAGEMENT -->
        <div class="options-section">
          <div class="options-sec-title">SAVE MANAGEMENT</div>
          <p class="save-sec-sub">Game automatically saves locally every 4 seconds. Export or import backup strings below:</p>
          <textarea id="save-string-box" class="save-textarea" placeholder="Save data string will appear here..."></textarea>
          <div class="save-actions-row">
            <button id="btn-modal-export" class="btn btn-primary btn-sm">Export Save</button>
            <button id="btn-modal-import" class="btn btn-accent btn-sm">Import Save</button>
            <button id="btn-modal-hardreset" class="btn btn-danger btn-sm">Hard Reset</button>
          </div>
        </div>
      </div>

      <div class="options-modal-footer">
        <button id="btn-options-close" class="btn btn-outline btn-sm">Close</button>
      </div>
    `;

    this.dom.modalOverlay.classList.remove('hidden');

    // SFX Slider & Toggle
    const sliderSfx = document.getElementById('slider-sfx-vol');
    const chkSfx = document.getElementById('chk-sfx-toggle');
    const sfxValText = document.getElementById('sfx-vol-val');

    if (sliderSfx && this.sound) {
      sliderSfx.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.sound.setSfxVolume(val / 100);
        if (this.sound.sfxEnabled && sfxValText) {
          sfxValText.textContent = `${val}%`;
        }
      });
    }

    if (chkSfx && this.sound) {
      chkSfx.addEventListener('change', (e) => {
        const enabled = this.sound.toggleSfx(e.target.checked);
        const curVal = sliderSfx ? parseInt(sliderSfx.value, 10) : 70;
        if (sfxValText) {
          sfxValText.textContent = enabled ? `${curVal}%` : 'MUTED';
        }
      });
    }

    // BGM Slider & Toggle
    const sliderBgm = document.getElementById('slider-bgm-vol');
    const chkBgm = document.getElementById('chk-bgm-toggle');
    const bgmValText = document.getElementById('bgm-vol-val');

    if (sliderBgm && this.sound) {
      sliderBgm.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        this.sound.setBgmVolume(val / 100);
        if (this.sound.bgmEnabled && bgmValText) {
          bgmValText.textContent = `${val}%`;
        }
      });
    }

    if (chkBgm && this.sound) {
      chkBgm.addEventListener('change', (e) => {
        const enabled = this.sound.toggleBgm(e.target.checked);
        const curVal = sliderBgm ? parseInt(sliderBgm.value, 10) : 40;
        if (bgmValText) {
          bgmValText.textContent = enabled ? `${curVal}%` : 'MUTED';
        }
      });
    }

    // Speed Selection Buttons
    document.querySelectorAll('.btn-speed-select').forEach(btn => {
      btn.addEventListener('click', () => {
        const spd = parseFloat(btn.dataset.speed);
        window.gameSpeed = spd;
        document.querySelectorAll('.btn-speed-select').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.addLog(`[SPEED] Game simulation set to ${spd}x.`, 'log-system');
      });
    });

    // Save Export / Import / Reset
    const textarea = document.getElementById('save-string-box');
    document.getElementById('btn-modal-export').addEventListener('click', () => {
      textarea.value = this.save.exportSaveString(this.state);
      textarea.select();
      navigator.clipboard.writeText(textarea.value);
      this.addLog('[SAVE] Save string copied to clipboard!', 'log-system');
      alert('Save string copied to clipboard!');
    });

    document.getElementById('btn-modal-import').addEventListener('click', () => {
      if (textarea.value.trim()) {
        if (this.save.importSaveString(textarea.value.trim())) {
          alert('Save successfully imported! Reloading...');
          window.location.reload();
        } else {
          alert('Invalid save string!');
        }
      }
    });

    document.getElementById('btn-modal-hardreset').addEventListener('click', () => {
      if (confirm('Are you ABSOLUTELY sure you want to completely erase all progress and restart?')) {
        this.save.reset();
      }
    });

    const closeHandler = () => this.closeModal();
    document.getElementById('btn-options-close').addEventListener('click', closeHandler);
    const xClose = document.getElementById('btn-options-x-close');
    if (xClose) xClose.addEventListener('click', closeHandler);
  }

  openAnalyticsModal() {
    this.openOptionsMenu();
  }

  openSaveModal() {
    this.openOptionsMenu();
  }

  showOfflineModal(report) {
    this.dom.modalContent.innerHTML = `
      <h3 style="margin-bottom: 8px; color: #f59e0b;">[OFFLINE PROGRESS REPORT]</h3>
      <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 12px;">While away for <strong>${report.durationStr}</strong>, your hero continued grinding:</p>
      
      <div style="background: #0b0f19; border: 1px solid #1e293b; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; font-size: 13px;">
        <div style="display: flex; justify-content: space-between;"><span>Monsters Slain:</span><strong>${this.formatNumber(report.kills)}</strong></div>
        <div style="display: flex; justify-content: space-between; color: #fde047;"><span>Gold Earned:</span><strong>+${this.formatNumber(report.gold)} Gold</strong></div>
        <div style="display: flex; justify-content: space-between; color: #c084fc;"><span>XP Gained:</span><strong>+${this.formatNumber(report.xp)} XP</strong></div>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <button id="btn-offline-claim" class="btn btn-primary btn-sm">Claim Rewards</button>
      </div>
    `;

    this.dom.modalOverlay.classList.remove('hidden');
    document.getElementById('btn-offline-claim').addEventListener('click', () => {
      this.closeModal();
      this.renderAll();
    });
  }

  closeModal() {
    this.dom.modalOverlay.classList.add('hidden');
  }

  formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
    return Math.floor(num).toLocaleString();
  }
}
