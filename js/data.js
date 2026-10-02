// ============================================================================
// AEGIS ENDLESS - GAME DATA DEFINITIONS & CONSTANTS
// ============================================================================

export function getCustomSpriteData() {
  try {
    const raw = localStorage.getItem('aegis_custom_sprites');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export const ITEM_TYPES = {
  MAIN_HAND: 'mainHand',
  OFF_HAND: 'offHand',
  HELMET: 'helmet',
  CHEST: 'chest',
  BOOTS: 'boots',
  RING_1: 'ring1',
  RING_2: 'ring2',
  AMULET: 'amulet'
};

export const RARITIES = {
  COMMON: { id: 'common', name: 'Common', color: '#94a3b8', multiplier: 1.0, maxAffixes: 0 },
  UNCOMMON: { id: 'uncommon', name: 'Uncommon', color: '#22c55e', multiplier: 1.3, maxAffixes: 1 },
  RARE: { id: 'rare', name: 'Rare', color: '#3b82f6', multiplier: 1.8, maxAffixes: 2 },
  EPIC: { id: 'epic', name: 'Epic', color: '#a855f7', multiplier: 2.5, maxAffixes: 3 },
  LEGENDARY: { id: 'legendary', name: 'Legendary', color: '#f59e0b', multiplier: 3.6, maxAffixes: 4 },
  MYTHIC: { id: 'mythic', name: 'Mythic', color: '#ec4899', multiplier: 5.5, maxAffixes: 5 }
};

export const AFFIXES = [
  { id: 'poison_potency', name: 'Poison Potency', stat: 'poisonDmg', min: 4, max: 18, isPercent: false, unit: 'Dmg/s', desc: 'Adds poison damage per tick' },
  { id: 'poison_chance', name: 'Toxic Coating', stat: 'poisonChance', min: 10, max: 35, isPercent: true, unit: '%', desc: 'Chance to inflict poison stack on hit' },
  { id: 'life_steal', name: 'Vampiric Leech', stat: 'lifeSteal', min: 2, max: 8, isPercent: true, unit: '%', desc: 'Converts hit damage into health' },
  { id: 'attack_speed', name: 'Swift Stride', stat: 'attackSpeed', min: 0.15, max: 0.6, isPercent: false, unit: '/s', desc: 'Increases attack frequency' },
  { id: 'crit_chance', name: 'Keen Edge', stat: 'critChance', min: 4, max: 15, isPercent: true, unit: '%', desc: 'Chance to deal critical damage' },
  { id: 'crit_mult', name: 'Devastation', stat: 'critMult', min: 20, max: 70, isPercent: true, unit: '%', desc: 'Increases critical damage multiplier' },
  { id: 'multistrike', name: 'Flurry', stat: 'multiStrike', min: 5, max: 20, isPercent: true, unit: '%', desc: 'Chance to strike an extra time' },
  { id: 'thorns', name: 'Spiked Barbs', stat: 'thorns', min: 8, max: 35, isPercent: false, unit: 'Dmg', desc: 'Reflects damage back to attacker' },
  { id: 'armor_pen', name: 'Sundering', stat: 'armorPen', min: 8, max: 25, isPercent: true, unit: '%', desc: 'Ignores a percentage of enemy armor' },
  { id: 'health_regen', name: 'Mending', stat: 'hpRegen', min: 3, max: 15, isPercent: false, unit: 'HP/s', desc: 'Passively restores health' },
  { id: 'gold_find', name: 'Prosperity', stat: 'goldFind', min: 10, max: 40, isPercent: true, unit: '%', desc: 'Increases gold dropped by slain foes' },
  { id: 'xp_boost', name: 'Wisdom', stat: 'xpBoost', min: 10, max: 35, isPercent: true, unit: '%', desc: 'Increases XP earned from kills' }
];

export const BIOMES = [
  {
    id: 'forest',
    name: 'Whispering Woods',
    type: 'outside',
    sprite: { r: 4, c: 6 },
    minStage: 1,
    maxStage: 10,
    ambientParticle: 'forest_spores',
    enemies: [
      { name: 'Spore Sprout', sheet: 'BASIC_MONSTERS', r: 2, c: 0 },
      { name: 'Moss Troll', sheet: 'BASIC_MONSTERS', r: 1, c: 1 },
      { name: 'Cave Ogre', sheet: 'BASIC_MONSTERS', r: 1, c: 0 },
      { name: 'Thorn Creeper', sheet: 'BASIC_MONSTERS', r: 2, c: 2 },
      { name: 'Golden Slime', sheet: 'BASIC_MONSTERS', r: 2, c: 3 }
    ],
    boss: { name: 'Bone Golem King', sheet: 'BASIC_MONSTERS', r: 0, c: 2, hpMult: 4.5, dmgMult: 1.8 }
  },
  {
    id: 'catacombs',
    name: 'Sunken Catacombs',
    type: 'dungeon',
    sprite: { r: 0, c: 0 },
    minStage: 11,
    maxStage: 20,
    ambientParticle: 'dungeon_drops',
    enemies: [
      { name: 'Watcher Eye', sheet: 'BASIC_MONSTERS', r: 0, c: 0 },
      { name: 'Blood Gazer', sheet: 'BASIC_MONSTERS', r: 0, c: 1 },
      { name: 'Tide Hunter Naga', sheet: 'HUMANOIDS', r: 1, c: 0 },
      { name: 'Abyssal Spearman', sheet: 'HUMANOIDS', r: 1, c: 2 },
      { name: 'Crypt Cultist', sheet: 'HUMANOIDS', r: 2, c: 2 }
    ],
    boss: { name: 'Trident Warlord', sheet: 'HUMANOIDS', r: 1, c: 3, hpMult: 5.5, dmgMult: 2.2 }
  },
  {
    id: 'crag',
    name: 'Molten Crag',
    type: 'cavern',
    sprite: { r: 0, c: 9 },
    minStage: 21,
    maxStage: 30,
    ambientParticle: 'magma_embers',
    enemies: [
      { name: 'Lesser Imp', sheet: 'DEMONS', r: 0, c: 0 },
      { name: 'Hellfire Demon', sheet: 'DEMONS', r: 0, c: 1 },
      { name: 'Infernal Succubus', sheet: 'DEMONS', r: 0, c: 4 },
      { name: 'Nether Stalker', sheet: 'DEMONS', r: 1, c: 2 },
      { name: 'Fire Drake', sheet: 'DRAGONS', r: 0, c: 1 }
    ],
    boss: { name: 'Horned Netherlord', sheet: 'DEMONS', r: 2, c: 2, hpMult: 6.8, dmgMult: 2.7 }
  },
  {
    id: 'citadel',
    name: 'Frozen Citadel',
    type: 'mountain',
    sprite: { r: 0, c: 8 },
    minStage: 31,
    maxStage: 40,
    ambientParticle: 'snow_blizzard',
    enemies: [
      { name: 'Frost Yeti', sheet: 'BASIC_MONSTERS', r: 0, c: 3 },
      { name: 'Glacial Revenant', sheet: 'DEMONS', r: 1, c: 3 },
      { name: 'Frost Wyrmling', sheet: 'DRAGONS', r: 0, c: 2 },
      { name: 'Glacial Drake', sheet: 'DRAGONS', r: 0, c: 3 },
      { name: 'Ice Drake Guardian', sheet: 'DRAGONS', r: 0, c: 3 }
    ],
    boss: { name: 'Ancient Glacial Dragon', sheet: 'DRAGONS', r: 0, c: 3, hpMult: 8.5, dmgMult: 3.2 }
  },
  {
    id: 'abyss',
    name: 'Abyssal Rift',
    type: 'void',
    sprite: { r: 0, c: 1 },
    minStage: 41,
    maxStage: 50,
    ambientParticle: 'void_motes',
    enemies: [
      { name: 'Void Eye Beast', sheet: 'DEMONS', r: 0, c: 3 },
      { name: 'Toxic Broodmother', sheet: 'DRAGONS', r: 2, c: 2 },
      { name: 'Azure Storm Wyrm', sheet: 'DRAGONS', r: 2, c: 3 },
      { name: 'Chaos Berserker', sheet: 'DEMONS', r: 2, c: 3 },
      { name: 'Shadow Dragon', sheet: 'DRAGONS', r: 0, c: 4 }
    ],
    boss: { name: 'Void Archon Malakor', sheet: 'DEMONS', r: 2, c: 4, hpMult: 11.0, dmgMult: 4.0 }
  },
  {
    id: 'sanctum',
    name: 'Celestial Sanctum',
    type: 'temple',
    sprite: { r: 12, c: 14 },
    minStage: 51,
    maxStage: 9999,
    ambientParticle: 'celestial_sparkles',
    enemies: [
      { name: 'Radiant Champion', sheet: 'HUMANOIDS', r: 0, c: 3 },
      { name: 'Solaris Archon', sheet: 'HUMANOIDS', r: 0, c: 2 },
      { name: 'Golden Drake', sheet: 'DRAGONS', r: 1, c: 2 },
      { name: 'Celestial Dragon', sheet: 'DRAGONS', r: 1, c: 3 },
      { name: 'Divine Sentinel', sheet: 'HUMANOIDS', r: 0, c: 4 }
    ],
    boss: { name: 'Emperor of the Aegis', sheet: 'HUMANOIDS', r: 2, c: 4, hpMult: 14.0, dmgMult: 4.8 }
  }
];

export const HERO_SPRITES = {
  NOVICE: { sheet: 'HUMANOIDS', r: 2, c: 0 },
  ASSASSIN: { sheet: 'HUMANOIDS', r: 2, c: 1 },
  RANGER: { sheet: 'HUMANOIDS', r: 0, c: 1 },
  MAGE: { sheet: 'HUMANOIDS', r: 0, c: 2 },
  PALADIN: { sheet: 'HUMANOIDS', r: 0, c: 3 },
  BERSERKER: { sheet: 'HUMANOIDS', r: 0, c: 4 },
  ASCENDED: { sheet: 'HUMANOIDS', r: 2, c: 4 }
};

export const RELICS = [
  { id: 'midas_chalice', name: 'Midas Chalice', sprite: { r: 12, c: 10 }, desc: '+25% Gold dropped from all monsters per rank', cost: 1, maxRank: 50, costMult: 1.5, effect: (rank) => ({ goldFind: rank * 25 }) },
  { id: 'chronos_dial', name: 'Chronos Dial', sprite: { r: 10, c: 15 }, desc: '+8% Attack Speed & Simulation Speed per rank', cost: 2, maxRank: 20, costMult: 1.8, effect: (rank) => ({ attackSpeedMult: rank * 0.08 }) },
  { id: 'venom_catalyst', name: 'Venom Catalyst', sprite: { r: 9, c: 6 }, desc: '+30% Poison & DoT damage scaling per rank', cost: 2, maxRank: 30, costMult: 1.6, effect: (rank) => ({ poisonDmgMult: rank * 0.30 }) },
  { id: 'blood_vessel', name: 'Vampiric Vessel', sprite: { r: 8, c: 7 }, desc: '+1.5% Base Life Steal across all builds per rank', cost: 3, maxRank: 20, costMult: 2.0, effect: (rank) => ({ lifeSteal: rank * 1.5 }) },
  { id: 'titans_heart', name: 'Titan’s Heart', sprite: { r: 1, c: 0 }, desc: '+20% Maximum HP and +10 Base Armor per rank', cost: 1, maxRank: 50, costMult: 1.4, effect: (rank) => ({ maxHpMult: rank * 0.20, armor: rank * 10 }) }
];

export const ITEM_TEMPLATES = [
  // Weapons (Main Hand)
  { type: ITEM_TYPES.MAIN_HAND, name: 'Iron Broadsword', sprite: { r: 5, c: 2 }, baseAtk: 10, baseAps: 1.2, tier: 1 },
  { type: ITEM_TYPES.MAIN_HAND, name: 'Viper Dagger', sprite: { r: 5, c: 7 }, baseAtk: 7, baseAps: 2.1, tier: 1, fixedAffix: { stat: 'poisonChance', val: 25 } },
  { type: ITEM_TYPES.MAIN_HAND, name: 'Steel Battleaxe', sprite: { r: 5, c: 11 }, baseAtk: 22, baseAps: 0.9, tier: 2 },
  { type: ITEM_TYPES.MAIN_HAND, name: 'Shadow Kris', sprite: { r: 5, c: 8 }, baseAtk: 16, baseAps: 2.4, tier: 2, fixedAffix: { stat: 'critChance', val: 12 } },
  { type: ITEM_TYPES.MAIN_HAND, name: 'Flame Greatsword', sprite: { r: 5, c: 3 }, baseAtk: 38, baseAps: 1.1, tier: 3 },
  { type: ITEM_TYPES.MAIN_HAND, name: 'Venomous Scythe', sprite: { r: 5, c: 14 }, baseAtk: 32, baseAps: 1.8, tier: 3, fixedAffix: { stat: 'poisonDmg', val: 25 } },
  { type: ITEM_TYPES.MAIN_HAND, name: 'Obsidian Cleaver', sprite: { r: 5, c: 4 }, baseAtk: 65, baseAps: 1.3, tier: 4 },
  { type: ITEM_TYPES.MAIN_HAND, name: 'Celestial Edge', sprite: { r: 5, c: 6 }, baseAtk: 110, baseAps: 2.0, tier: 5 },

  // Off Hands
  { type: ITEM_TYPES.OFF_HAND, name: 'Wooden Buckler', sprite: { r: 6, c: 0 }, baseBlock: 5, baseArmor: 6, tier: 1 },
  { type: ITEM_TYPES.OFF_HAND, name: 'Spiked Targ', sprite: { r: 6, c: 1 }, baseBlock: 8, baseArmor: 12, tier: 2, fixedAffix: { stat: 'thorns', val: 15 } },
  { type: ITEM_TYPES.OFF_HAND, name: 'Parrying Dagger', sprite: { r: 5, c: 9 }, baseBlock: 4, baseArmor: 4, tier: 2, fixedAffix: { stat: 'multiStrike', val: 14 } },
  { type: ITEM_TYPES.OFF_HAND, name: 'Aegis of Valor', sprite: { r: 6, c: 2 }, baseBlock: 18, baseArmor: 35, tier: 3 },
  { type: ITEM_TYPES.OFF_HAND, name: 'Void Tome', sprite: { r: 13, c: 4 }, baseBlock: 0, baseArmor: 10, tier: 4, fixedAffix: { stat: 'poisonDmg', val: 40 } },

  // Helmets
  { type: ITEM_TYPES.HELMET, name: 'Leather Cap', sprite: { r: 7, c: 0 }, baseHp: 20, baseArmor: 3, tier: 1 },
  { type: ITEM_TYPES.HELMET, name: 'Iron Fullhelm', sprite: { r: 7, c: 1 }, baseHp: 45, baseArmor: 10, tier: 2 },
  { type: ITEM_TYPES.HELMET, name: 'Crown of Shadows', sprite: { r: 7, c: 2 }, baseHp: 80, baseArmor: 15, tier: 3, fixedAffix: { stat: 'critChance', val: 8 } },
  { type: ITEM_TYPES.HELMET, name: 'Dragonbone Mask', sprite: { r: 7, c: 3 }, baseHp: 160, baseArmor: 30, tier: 4 },

  // Chest Armor
  { type: ITEM_TYPES.CHEST, name: 'Cloth Tunic', sprite: { r: 7, c: 4 }, baseHp: 30, baseArmor: 5, tier: 1 },
  { type: ITEM_TYPES.CHEST, name: 'Chainmail Hauberk', sprite: { r: 7, c: 5 }, baseHp: 75, baseArmor: 18, tier: 2 },
  { type: ITEM_TYPES.CHEST, name: 'Platemail of the Titan', sprite: { r: 7, c: 7 }, baseHp: 180, baseArmor: 45, tier: 3 },
  { type: ITEM_TYPES.CHEST, name: 'Carapace of the Leviathan', sprite: { r: 7, c: 6 }, baseHp: 350, baseArmor: 85, tier: 4 },

  // Boots
  { type: ITEM_TYPES.BOOTS, name: 'Worn Sandals', sprite: { r: 8, c: 2 }, baseDodge: 2, baseArmor: 2, tier: 1 },
  { type: ITEM_TYPES.BOOTS, name: 'Leather Greaves', sprite: { r: 7, c: 11 }, baseDodge: 5, baseArmor: 6, tier: 2 },
  { type: ITEM_TYPES.BOOTS, name: 'Windwalker Treads', sprite: { r: 8, c: 3 }, baseDodge: 12, baseArmor: 12, tier: 3, fixedAffix: { stat: 'attackSpeed', val: 0.3 } },
  { type: ITEM_TYPES.BOOTS, name: 'Abyssal Striders', sprite: { r: 8, c: 3 }, baseDodge: 20, baseArmor: 25, tier: 4 },

  // Rings & Amulets
  { type: ITEM_TYPES.RING_1, name: 'Copper Band', sprite: { r: 8, c: 4 }, baseAtk: 4, tier: 1 },
  { type: ITEM_TYPES.RING_1, name: 'Ring of Precision', sprite: { r: 8, c: 5 }, baseAtk: 8, tier: 2, fixedAffix: { stat: 'critChance', val: 6 } },
  { type: ITEM_TYPES.RING_1, name: 'Band of the Viper', sprite: { r: 8, c: 4 }, baseAtk: 12, tier: 3, fixedAffix: { stat: 'poisonChance', val: 20 } },
  { type: ITEM_TYPES.RING_2, name: 'Iron Signet', sprite: { r: 8, c: 5 }, baseHp: 25, tier: 1 },
  { type: ITEM_TYPES.RING_2, name: 'Bloodstone Ring', sprite: { r: 8, c: 5 }, baseHp: 60, tier: 2, fixedAffix: { stat: 'lifeSteal', val: 3 } },
  { type: ITEM_TYPES.RING_2, name: 'Ring of Endless Flurry', sprite: { r: 8, c: 4 }, baseHp: 120, tier: 3, fixedAffix: { stat: 'multiStrike', val: 12 } },
  { type: ITEM_TYPES.AMULET, name: 'Bone Talisman', sprite: { r: 8, c: 8 }, baseHp: 35, baseAtk: 5, tier: 1 },
  { type: ITEM_TYPES.AMULET, name: 'Pendant of the Leech', sprite: { r: 8, c: 7 }, baseHp: 80, baseAtk: 12, tier: 2, fixedAffix: { stat: 'lifeSteal', val: 4.5 } },
  { type: ITEM_TYPES.AMULET, name: 'Heart of the Basilisk', sprite: { r: 8, c: 6 }, baseHp: 150, baseAtk: 24, tier: 3, fixedAffix: { stat: 'poisonDmg', val: 35 } }
];
