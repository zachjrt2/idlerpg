// ============================================================================
// AEGIS ENDLESS - SHOP, INVENTORY & THE ARCANE FORGE
// ============================================================================

import { ITEM_TYPES, RARITIES, AFFIXES, ITEM_TEMPLATES } from './data.js';

export class ShopManager {
  constructor(state, statsManager, soundEngine, uiManager) {
    this.state = state;
    this.stats = statsManager;
    this.sound = soundEngine;
    this.ui = uiManager;
    this.achievements = null;

    this.selectedForgeItem = null;
    this.selectedForgeLocation = null; // { type: 'equip' | 'inv', indexOrSlot: string|number }

    // Fusion Crucible Catalysts (up to 5 items)
    this.crucibleSlots = [];
  }

  setAchievements(achievementsManager) {
    this.achievements = achievementsManager;
  }

  // Add item from backpack into Fusion Crucible (Supports ANY item quality)
  addToCrucible(invIndex) {
    const item = this.state.inventory[invIndex];
    if (!item) return false;

    // If already in crucible, toggle / remove it
    const existingIdx = this.crucibleSlots.findIndex(entry => entry.invIndex === invIndex);
    if (existingIdx !== -1) {
      this.removeFromCrucible(existingIdx);
      return 'removed';
    }

    if (this.crucibleSlots.length >= 5) {
      this.ui.addLog(`[CRUCIBLE FULL] Maximum 5 catalyst items can be merged at once.`, 'log-defeat');
      return false;
    }

    this.crucibleSlots.push({ item, invIndex });
    this.sound.playSlash();
    return 'added';
  }

  removeFromCrucible(crucibleIndex) {
    if (crucibleIndex >= 0 && crucibleIndex < this.crucibleSlots.length) {
      this.crucibleSlots.splice(crucibleIndex, 1);
      this.sound.playSlash();
      return true;
    }
    return false;
  }

  clearCrucible() {
    this.crucibleSlots = [];
  }

  // Auto fill crucible with up to 5 Common/Uncommon items from inventory
  fillCrucibleWithJunk() {
    this.crucibleSlots = [];
    for (let i = 0; i < this.state.inventory.length; i++) {
      const item = this.state.inventory[i];
      if (item && (item.rarity === 'common' || item.rarity === 'uncommon')) {
        this.crucibleSlots.push({ item, invIndex: i });
        if (this.crucibleSlots.length >= 5) break;
      }
    }
    if (this.crucibleSlots.length > 0) {
      this.sound.playSlash();
    }
  }

  // Calculate probabilities based on crucible items
  calculateCrucibleOdds(customItems = null) {
    const items = customItems || this.crucibleSlots.map(s => s.item);
    if (items.length < 2) {
      return null;
    }

    const count = items.length;
    const rarityRankMap = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };
    const ranks = items.map(i => rarityRankMap[i.rarity] ?? 0);

    // Calculate average rarity rank of input catalysts
    const avgRank = ranks.reduce((a, b) => a + b, 0) / count;
    const baseRank = Math.min(4, Math.floor(avgRank));
    const remainder = avgRank - baseRank;

    // Strict Upgrade Rates:
    // 2 items = 8%
    // 3 items = 14%
    // 4 items = 21%
    // 5 items = 30% (5 greens = 30% chance for blue)
    const countUpgradeRates = { 2: 8, 3: 14, 4: 21, 5: 30 };
    const baseUpgradeRate = countUpgradeRates[count] || 8;
    
    // Modest bonus when mixing higher rarity catalysts
    const totalUpgradeChance = Math.min(50, Math.round(baseUpgradeRate + remainder * 20));

    const probs = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 };
    const rankKeys = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];

    const targetBaseRank = baseRank;
    const targetUpgradeRank = Math.min(5, baseRank + 1);

    // Minor 2% jackpot jump if 5 items merged and not already at mythic
    let jackpotChance = 0;
    if (count === 5 && targetUpgradeRank < 5 && totalUpgradeChance >= 30) {
      jackpotChance = 2;
    }

    const upgradePct = totalUpgradeChance - jackpotChance;
    const basePct = 100 - totalUpgradeChance;

    probs[rankKeys[targetBaseRank]] = basePct;
    probs[rankKeys[targetUpgradeRank]] = (probs[rankKeys[targetUpgradeRank]] || 0) + upgradePct;
    if (jackpotChance > 0 && targetUpgradeRank + 1 <= 5) {
      probs[rankKeys[targetUpgradeRank + 1]] = (probs[rankKeys[targetUpgradeRank + 1]] || 0) + jackpotChance;
    }

    // Tier calculation: Highest input tier with modest upgrade chance
    const maxTier = Math.max(...items.map(i => i.tier || 1));
    const tierUpRates = { 2: 5, 3: 10, 4: 16, 5: 22 };
    const tierUpChance = Math.min(35, tierUpRates[count] || 5);

    return {
      count,
      avgRank: parseFloat(avgRank.toFixed(2)),
      maxTier,
      tierUpChance,
      probabilities: probs
    };
  }

  // Fuse the items currently in the Crucible
  fuseCrucibleItems() {
    if (this.crucibleSlots.length < 2) {
      this.ui.addLog(`[FUSION] Place at least 2 items into the Crucible to merge.`, 'log-defeat');
      return null;
    }

    const odds = this.calculateCrucibleOdds();
    if (!odds) return null;

    const items = this.crucibleSlots.map(s => s.item);

    // Roll Rarity based on calculated probabilities
    const roll = Math.random() * 100;
    let accumulated = 0;
    let chosenRarity = RARITIES.COMMON;

    const p = odds.probabilities;
    const rarityOrder = [
      { def: RARITIES.COMMON, pct: p.common },
      { def: RARITIES.UNCOMMON, pct: p.uncommon },
      { def: RARITIES.RARE, pct: p.rare },
      { def: RARITIES.EPIC, pct: p.epic },
      { def: RARITIES.LEGENDARY, pct: p.legendary },
      { def: RARITIES.MYTHIC, pct: p.mythic }
    ];

    for (const r of rarityOrder) {
      accumulated += r.pct;
      if (roll <= accumulated && r.pct > 0) {
        chosenRarity = r.def;
        break;
      }
    }

    // Roll Tier
    let resultTier = odds.maxTier;
    if (Math.random() * 100 < odds.tierUpChance && resultTier < 5) {
      resultTier += 1;
    }

    // Inherit max level with possible upgrade
    const maxLevel = Math.max(0, ...items.map(i => i.level || 0));
    const resultLevel = (items.length >= 4 && Math.random() < 0.4) ? maxLevel + 1 : maxLevel;

    // Pick base template for target tier
    const validTemplates = ITEM_TEMPLATES.filter(t => t.tier === resultTier);
    const template = validTemplates.length > 0
      ? validTemplates[Math.floor(Math.random() * validTemplates.length)]
      : ITEM_TEMPLATES[0];

    // Roll Affixes
    const affixes = [];
    if (template.fixedAffix) {
      affixes.push({
        stat: template.fixedAffix.stat,
        val: template.fixedAffix.val
      });
    }

    const availableAffixes = [...AFFIXES];
    for (let i = 0; i < chosenRarity.maxAffixes; i++) {
      if (availableAffixes.length === 0) break;
      const affixIdx = Math.floor(Math.random() * availableAffixes.length);
      const affixDef = availableAffixes.splice(affixIdx, 1)[0];

      const affixScale = (1 + (template.tier - 1) * 0.45) * chosenRarity.multiplier;
      const rawVal = affixDef.min + Math.random() * (affixDef.max - affixDef.min);
      const val = affixDef.isPercent ? parseFloat((rawVal * affixScale).toFixed(1)) : Math.round(rawVal * affixScale);

      affixes.push({
        id: affixDef.id,
        name: affixDef.name,
        stat: affixDef.stat,
        val,
        isPercent: affixDef.isPercent,
        unit: affixDef.unit
      });
    }

    const basePrice = Math.floor((80 * Math.pow(1.35, template.tier - 1) * chosenRarity.multiplier) + (template.tier * 30));

    const fusedItem = {
      id: 'fused_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      name: `${template.name}`,
      icon: template.icon,
      sprite: template.sprite || null,
      type: template.type,
      tier: template.tier,
      rarity: chosenRarity.id,
      rarityColor: chosenRarity.color,
      level: resultLevel,
      baseAtk: template.baseAtk || 0,
      baseAps: template.baseAps || 0,
      baseHp: template.baseHp || 0,
      baseArmor: template.baseArmor || 0,
      baseBlock: template.baseBlock || 0,
      baseDodge: template.baseDodge || 0,
      affixes,
      price: basePrice
    };

    // Remove consumed items from inventory
    // Sort indices descending to avoid splice index shifting
    const indicesToRemove = this.crucibleSlots.map(s => s.invIndex).sort((a, b) => b - a);
    for (const idx of indicesToRemove) {
      if (idx >= 0 && idx < this.state.inventory.length) {
        this.state.inventory.splice(idx, 1);
      }
    }

    // Add fused item to inventory
    this.state.inventory.push(fusedItem);
    this.crucibleSlots = [];

    this.sound.playFuse();
    this.ui.addLog(`[FUSION SUCCESS] Merged ${items.length} items into <strong>${chosenRarity.name} ${fusedItem.name}</strong> (Tier ${fusedItem.tier})!`, 'log-kill');

    return fusedItem;
  }

  // 1-Click: Automatically batch merge all junk items in backpack
  mergeAllJunk() {
    // Find all unequipped Common & Uncommon items in inventory
    const junkIndices = [];
    for (let i = 0; i < this.state.inventory.length; i++) {
      const item = this.state.inventory[i];
      if (item && (item.rarity === 'common' || item.rarity === 'uncommon')) {
        junkIndices.push(i);
      }
    }

    if (junkIndices.length < 2) {
      this.ui.addLog(`[MERGE] Need at least 2 Common/Uncommon items to merge.`, 'log-defeat');
      return 0;
    }

    let mergedCount = 0;
    let craftedItems = [];

    // Group in optimal batches of 4-5 items
    while (junkIndices.length >= 2) {
      const batchSize = junkIndices.length >= 5 ? 5 : (junkIndices.length === 4 ? 4 : (junkIndices.length === 3 ? 3 : 2));
      const currentBatchIndices = junkIndices.splice(0, batchSize);

      this.crucibleSlots = currentBatchIndices.map(idx => ({
        item: this.state.inventory[idx],
        invIndex: idx
      }));

      const result = this.fuseCrucibleItems();
      if (result) {
        mergedCount += batchSize;
        craftedItems.push(result);
      }

      // Re-index junk indices since inventory shifted
      junkIndices.length = 0;
      for (let i = 0; i < this.state.inventory.length; i++) {
        const item = this.state.inventory[i];
        if (item && (item.rarity === 'common' || item.rarity === 'uncommon')) {
          junkIndices.push(i);
        }
      }
    }

    if (mergedCount > 0) {
      this.sound.playFuse();
      this.ui.addLog(`[AUTO-MERGE] Compressed ${mergedCount} junk items into ${craftedItems.length} superior items!`, 'log-item');
    }

    return mergedCount;
  }

  init() {
    if (!this.state.shopStock || this.state.shopStock.length === 0) {
      this.generateShopStock();
    }
  }

  // Generate a random item based on maxStage reached
  generateRandomItem(forcedTier = null) {
    const stage = this.state.maxStage || 1;
    const tier = forcedTier || Math.min(5, Math.max(1, Math.floor((stage - 1) / 8) + 1));
    
    // Filter templates for current tier or lower
    const validTemplates = ITEM_TEMPLATES.filter(t => t.tier <= tier);
    const template = validTemplates[Math.floor(Math.random() * validTemplates.length)];

    // Roll Rarity
    const rarityRoll = Math.random() * 100;
    let rarity = RARITIES.COMMON;

    if (rarityRoll < 2 && stage >= 25) rarity = RARITIES.MYTHIC;
    else if (rarityRoll < 8 && stage >= 15) rarity = RARITIES.LEGENDARY;
    else if (rarityRoll < 22 && stage >= 8) rarity = RARITIES.EPIC;
    else if (rarityRoll < 45 && stage >= 3) rarity = RARITIES.RARE;
    else if (rarityRoll < 75) rarity = RARITIES.UNCOMMON;

    // Roll Affixes
    const affixes = [];
    if (template.fixedAffix) {
      affixes.push({
        stat: template.fixedAffix.stat,
        val: template.fixedAffix.val
      });
    }

    const availableAffixes = [...AFFIXES];
    for (let i = 0; i < rarity.maxAffixes; i++) {
      if (availableAffixes.length === 0) break;
      const affixIdx = Math.floor(Math.random() * availableAffixes.length);
      const affixDef = availableAffixes.splice(affixIdx, 1)[0];

      // Scale affix with tier and rarity
      const affixScale = (1 + (template.tier - 1) * 0.4) * rarity.multiplier;
      const rawVal = affixDef.min + Math.random() * (affixDef.max - affixDef.min);
      const val = affixDef.isPercent ? parseFloat((rawVal * affixScale).toFixed(1)) : Math.round(rawVal * affixScale);

      affixes.push({
        id: affixDef.id,
        name: affixDef.name,
        stat: affixDef.stat,
        val,
        isPercent: affixDef.isPercent,
        unit: affixDef.unit
      });
    }

    // Base Price calculation
    const basePrice = Math.floor((60 * Math.pow(1.3, template.tier - 1) * rarity.multiplier) + (template.tier * 25));

    return {
      id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
      name: template.name,
      icon: template.icon,
      sprite: template.sprite || null,
      type: template.type,
      tier: template.tier,
      rarity: rarity.id,
      rarityColor: rarity.color,
      level: 0,
      baseAtk: template.baseAtk || 0,
      baseAps: template.baseAps || 0,
      baseHp: template.baseHp || 0,
      baseArmor: template.baseArmor || 0,
      baseBlock: template.baseBlock || 0,
      baseDodge: template.baseDodge || 0,
      affixes,
      price: basePrice
    };
  }

  // Populate Shop Catalog
  generateShopStock() {
    const stock = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
      stock.push(this.generateRandomItem());
    }
    this.state.shopStock = stock;
  }

  refreshShopStock() {
    const cost = this.getRefreshCost();
    if (this.state.gold >= cost) {
      this.state.gold -= cost;
      this.generateShopStock();
      this.sound.playGold();
      this.ui.addLog(`[RESTOCK] Merchant refreshed shop wares for ${cost} Gold.`, 'log-system');
      return true;
    }
    return false;
  }

  getRefreshCost() {
    const stage = this.state.maxStage || 1;
    return Math.floor(30 * Math.pow(1.1, Math.min(20, stage)));
  }

  // Purchase item from shop
  buyShopItem(index) {
    if (!this.state.shopStock || !this.state.shopStock[index]) return false;
    const item = this.state.shopStock[index];

    const currentGold = Number(this.state.gold) || 0;
    const itemPrice = Number(item.price) || 0;

    if (currentGold < itemPrice) {
      if (this.ui && this.ui.addLog) {
        this.ui.addLog(`[CANNOT AFFORD] Not enough Gold! Need ${itemPrice} Gold (Have: ${Math.floor(currentGold)}).`, 'log-defeat');
      }
      return false;
    }

    if (!Array.isArray(this.state.inventory)) {
      this.state.inventory = [];
    }

    // Check inventory space (Max 24 slots)
    if (this.state.inventory.length >= 24) {
      if (this.ui && this.ui.addLog) {
        this.ui.addLog(`[INVENTORY FULL] Backpack is full (24/24)! Salvage or equip items first.`, 'log-defeat');
      }
      return false;
    }

    this.state.gold = Math.max(0, currentGold - itemPrice);
    this.state.inventory.push(item);
    this.state.shopStock.splice(index, 1);

    if (this.sound && typeof this.sound.playGold === 'function') {
      this.sound.playGold();
    }
    if (this.ui && this.ui.addLog) {
      this.ui.addLog(`[PURCHASE] Bought <strong>${item.name}</strong> for ${itemPrice} Gold.`, 'log-item');
    }
    return true;
  }

  // Helper to test if an item is compatible with a given equipment slot
  isSlotCompatible(item, slotKey) {
    if (!item || !slotKey) return false;
    if (item.type === ITEM_TYPES.RING_1 || item.type === ITEM_TYPES.RING_2) {
      return slotKey === 'ring1' || slotKey === 'ring2';
    }
    return item.type === slotKey;
  }

  // Equip item from inventory into proper equipment slot
  equipItem(invIndex, targetSlot = null) {
    const item = this.state.inventory[invIndex];
    if (!item) return false;

    let slot = targetSlot;
    if (!slot) {
      if (item.type === ITEM_TYPES.RING_1 || item.type === ITEM_TYPES.RING_2) {
        if (!this.state.equipment.ring1) slot = 'ring1';
        else if (!this.state.equipment.ring2) slot = 'ring2';
        else slot = 'ring1';
      } else {
        slot = item.type;
      }
    }

    if (!this.isSlotCompatible(item, slot)) {
      this.ui.addLog(`[CANNOT EQUIP] Cannot equip ${item.name} to ${slot}.`, 'log-defeat');
      return false;
    }

    const previousEquipped = this.state.equipment[slot];
    this.state.equipment[slot] = item;

    if (previousEquipped) {
      // Replace in-place at the exact inventory index
      this.state.inventory[invIndex] = previousEquipped;
    } else {
      this.state.inventory.splice(invIndex, 1);
    }

    this.sound.playSlash();
    this.ui.addLog(`[EQUIPPED] <strong>${item.name}</strong> (${slot}).`, 'log-item');
    return true;
  }

  // Swap two equipment slots (e.g., ring1 and ring2)
  swapEquipmentSlots(slot1, slot2) {
    if (slot1 === slot2) return false;
    const item1 = this.state.equipment[slot1];
    const item2 = this.state.equipment[slot2];

    const canPut1in2 = !item1 || this.isSlotCompatible(item1, slot2);
    const canPut2in1 = !item2 || this.isSlotCompatible(item2, slot1);

    if (canPut1in2 && canPut2in1) {
      this.state.equipment[slot1] = item2;
      this.state.equipment[slot2] = item1;
      this.sound.playSlash();
      this.ui.addLog(`[SWAPPED] Reorganized equipped gear.`, 'log-system');
      return true;
    }
    return false;
  }

  // Swap or reorder items inside the inventory backpack
  swapInventorySlots(fromIdx, toIdx) {
    if (fromIdx === toIdx) return false;
    if (fromIdx < 0 || fromIdx >= this.state.inventory.length) return false;

    const fromItem = this.state.inventory[fromIdx];
    if (toIdx >= 0 && toIdx < this.state.inventory.length) {
      const toItem = this.state.inventory[toIdx];
      this.state.inventory[fromIdx] = toItem;
      this.state.inventory[toIdx] = fromItem;
    } else {
      this.state.inventory.splice(fromIdx, 1);
      this.state.inventory.push(fromItem);
    }
    this.sound.playSlash();
    return true;
  }

  // Unequip item into inventory
  unequipItem(slotKey, targetInvIndex = null) {
    const item = this.state.equipment[slotKey];
    if (!item) return false;

    if (this.state.inventory.length >= 24) {
      this.ui.addLog(`[INVENTORY FULL] Backpack is full! Cannot unequip item.`, 'log-defeat');
      return false;
    }

    this.state.equipment[slotKey] = null;
    if (targetInvIndex !== null && targetInvIndex >= 0 && targetInvIndex < this.state.inventory.length) {
      this.state.inventory.splice(targetInvIndex, 0, item);
    } else {
      this.state.inventory.push(item);
    }
    this.sound.playSlash();
    this.ui.addLog(`[UNEQUIPPED] <strong>${item.name}</strong>.`, 'log-item');
    return true;
  }

  // Quick Salvage all unequipped Common & Uncommon items for Gold
  salvageUnusedItems() {
    let totalGoldGain = 0;
    const keptItems = [];

    for (const item of this.state.inventory) {
      if (item.rarity === 'common' || item.rarity === 'uncommon') {
        const yieldGold = Math.floor(item.price * 0.4);
        totalGoldGain += yieldGold;
      } else {
        keptItems.push(item);
      }
    }

    if (totalGoldGain > 0) {
      this.state.inventory = keptItems;
      this.state.gold += totalGoldGain;
      this.sound.playGold();
      this.ui.addLog(`[SALVAGE] Salvaged low-tier items for +<strong>${totalGoldGain} Gold</strong>.`, 'log-item');
    }
  }

  // The Forge: Select item for enhancement or reforging
  selectItemForForge(item, location) {
    this.selectedForgeItem = item;
    this.selectedForgeLocation = location;
  }

  getEnhanceCost(item) {
    const lvl = item.level || 0;
    return Math.floor((50 * Math.pow(1.28, lvl) * item.tier) + (lvl * 30));
  }

  getEnhanceSuccessRate(item) {
    const lvl = item.level || 0;
    if (lvl < 5) return 95;
    if (lvl < 10) return 85;
    if (lvl < 15) return 70;
    if (lvl < 25) return 50;
    return 35;
  }

  getReforgeCost(item) {
    return Math.floor(item.price * 0.6);
  }

  getSalvageYield(item) {
    return Math.floor((item.price * 0.45) + ((item.level || 0) * 40));
  }

  // Enhance Item (+1 level)
  enhanceItem() {
    const item = this.selectedForgeItem;
    if (!item) return;

    const cost = this.getEnhanceCost(item);
    if (this.state.gold < cost) {
      this.ui.addLog(`[INSUFFICIENT GOLD] Need ${cost} Gold to enhance ${item.name}!`, 'log-defeat');
      return;
    }

    this.state.gold -= cost;
    const rate = this.getEnhanceSuccessRate(item);
    const success = (Math.random() * 100) < rate;

    if (success) {
      item.level = (item.level || 0) + 1;
      if (this.achievements) {
        this.achievements.trackEnhanceLevel(item.level);
      }
      this.sound.playLevelUp();
      this.ui.addLog(`[ENHANCE SUCCESS] <strong>${item.name}</strong> is now +${item.level}!`, 'log-kill');
    } else {
      this.sound.playDefeat();
      this.ui.addLog(`[ENHANCE FAILED] Failed on ${item.name}. (Item was not destroyed).`, 'log-defeat');
    }
  }

  // Reforge Item Affixes (Re-roll secondary bonuses)
  reforgeAffixes() {
    const item = this.selectedForgeItem;
    if (!item) return;

    const cost = this.getReforgeCost(item);
    if (this.state.gold < cost) {
      this.ui.addLog(`[INSUFFICIENT GOLD] Need ${cost} Gold to reforge ${item.name}!`, 'log-defeat');
      return;
    }

    this.state.gold -= cost;
    const rarityDef = RARITIES[item.rarity.toUpperCase()] || RARITIES.COMMON;
    const newAffixes = [];
    const availableAffixes = [...AFFIXES];

    for (let i = 0; i < rarityDef.maxAffixes; i++) {
      if (availableAffixes.length === 0) break;
      const affixIdx = Math.floor(Math.random() * availableAffixes.length);
      const affixDef = availableAffixes.splice(affixIdx, 1)[0];

      const affixScale = (1 + (item.tier - 1) * 0.4) * rarityDef.multiplier;
      const rawVal = affixDef.min + Math.random() * (affixDef.max - affixDef.min);
      const val = affixDef.isPercent ? parseFloat((rawVal * affixScale).toFixed(1)) : Math.round(rawVal * affixScale);

      newAffixes.push({
        id: affixDef.id,
        name: affixDef.name,
        stat: affixDef.stat,
        val,
        isPercent: affixDef.isPercent,
        unit: affixDef.unit
      });
    }

    item.affixes = newAffixes;
    this.sound.playCrit();
    this.ui.addLog(`[REFORGED] New affixes rolled for <strong>${item.name}</strong>!`, 'log-item');
  }

  // Salvage selected forge item
  salvageSelectedItem() {
    const item = this.selectedForgeItem;
    const loc = this.selectedForgeLocation;
    if (!item || !loc) return;

    const yieldGold = this.getSalvageYield(item);
    this.state.gold += yieldGold;

    if (loc.type === 'inv') {
      this.state.inventory.splice(loc.indexOrSlot, 1);
    } else if (loc.type === 'equip') {
      this.state.equipment[loc.indexOrSlot] = null;
    }

    this.selectedForgeItem = null;
    this.selectedForgeLocation = null;
    this.sound.playGold();
    this.ui.addLog(`[SALVAGED] Received +<strong>${yieldGold} Gold</strong>.`, 'log-item');
  }
}
