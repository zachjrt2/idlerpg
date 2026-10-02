// ============================================================================
// AEGIS ART STUDIO & SPRITE NAMER CONTROLLER
// ============================================================================

const SPRITE_SHEETS = [
  {
    id: 'items',
    name: 'Items & Icons',
    path: 'art/items/#1 - Transparent Icons.png',
    type: 'grid',
    tileSize: 32,
    categoryDefault: 'item'
  },
  {
    id: 'basic',
    name: 'Basic Monsters',
    path: 'art/sprites/Basic 4x.png',
    type: 'monsters',
    cols: 5,
    rows: 3,
    categoryDefault: 'monster'
  },
  {
    id: 'demons',
    name: 'Demons & Fiends',
    path: 'art/sprites/Basic Demons 4x.png',
    type: 'monsters',
    cols: 5,
    rows: 3,
    categoryDefault: 'monster'
  },
  {
    id: 'dragons',
    name: 'Dragons & Wyrms',
    path: 'art/sprites/Basic Dragon 4x.png',
    type: 'monsters',
    cols: 5,
    rows: 3,
    categoryDefault: 'monster'
  },
  {
    id: 'humanoids',
    name: 'Humanoids & Heroes',
    path: 'art/sprites/Basic Humanoid II 4x.png',
    type: 'heroes',
    cols: 5,
    rows: 3,
    categoryDefault: 'hero'
  }
];

// Comprehensive First-Pass Dictionary for Every Single Sprite & Icon
const PRESET_NAMES = {
  // === ROW 0: STATUS & CURSES ===
  'items_r0_c0': { name: 'Death Curse', category: 'status' },
  'items_r0_c1': { name: 'Poison Flame', category: 'status' },
  'items_r0_c2': { name: 'Slumber Eye', category: 'status' },
  'items_r0_c3': { name: 'Speech Bubble', category: 'utility' },
  'items_r0_c4': { name: 'Feral Snarl', category: 'status' },
  'items_r0_c5': { name: 'Holy Radiance', category: 'status' },
  'items_r0_c6': { name: 'Charm / Love', category: 'status' },
  'items_r0_c7': { name: 'Deep Sleep', category: 'status' },
  'items_r0_c8': { name: 'Shock Lightning', category: 'status' },
  'items_r0_c9': { name: 'Ignite / Burn', category: 'status' },
  'items_r0_c10': { name: 'Water Drenched', category: 'status' },

  // === ROW 1: ANATOMY & VITALS ===
  'items_r1_c0': { name: 'Vital Heart', category: 'material' },
  'items_r1_c1': { name: 'Clean Lungs', category: 'material' },
  'items_r1_c2': { name: 'Stomach', category: 'material' },
  'items_r1_c3': { name: 'Psionic Brain', category: 'material' },
  'items_r1_c4': { name: 'Bicep of Might', category: 'status' },

  // === ROW 2: BUFF & DEBUFF ARROWS ===
  'items_r2_c0': { name: 'Power Up Buff', category: 'status' },
  'items_r2_c1': { name: 'Weakness Debuff', category: 'status' },
  'items_r2_c2': { name: 'Speed Surge', category: 'status' },
  'items_r2_c3': { name: 'Armor Shatter', category: 'status' },
  'items_r2_c4': { name: 'Ascending Wind', category: 'status' },
  'items_r2_c5': { name: 'Gravity Fall', category: 'status' },
  'items_r2_c6': { name: 'Cooldown Reset', category: 'status' },

  // === ROW 3: COMBAT TECHNIQUES & GLYPHS ===
  'items_r3_c0': { name: 'Bleed Lacerate', category: 'weapon' },
  'items_r3_c1': { name: 'Flame Saber', category: 'weapon' },
  'items_r3_c2': { name: 'Cross Slash', category: 'weapon' },
  'items_r3_c3': { name: 'Necrotic Cleave', category: 'weapon' },
  'items_r3_c4': { name: 'Dual Axe Whirlwind', category: 'weapon' },
  'items_r3_c5': { name: 'Aegis Barrier', category: 'armor' },
  'items_r3_c6': { name: 'Shoulder Charge', category: 'weapon' },
  'items_r3_c7': { name: 'Iron Guard Stance', category: 'armor' },
  'items_r3_c8': { name: 'Downward Impale', category: 'weapon' },
  'items_r3_c9': { name: 'Ring of Fire', category: 'weapon' },
  'items_r3_c10': { name: 'Skull Crusher', category: 'weapon' },
  'items_r3_c11': { name: 'Heavy Fist', category: 'weapon' },
  'items_r3_c12': { name: 'Gale Wind Blade', category: 'weapon' },
  'items_r3_c13': { name: 'Earthquake Stomp', category: 'weapon' },
  'items_r3_c14': { name: 'Arcane Ward', category: 'armor' },
  'items_r3_c15': { name: 'Solar Flash', category: 'status' },

  // === ROW 4: CAMPING & EXPLORATION ===
  'items_r4_c0': { name: 'Tavern Talk', category: 'utility' },
  'items_r4_c1': { name: 'Whispered Secret', category: 'utility' },
  'items_r4_c2': { name: 'Resting Campfire', category: 'utility' },
  'items_r4_c3': { name: 'Canvas Shelter', category: 'utility' },
  'items_r4_c4': { name: 'Blacksmith Anvil', category: 'utility' },
  'items_r4_c5': { name: 'Mining Vein', category: 'utility' },
  'items_r4_c6': { name: 'Lumberjack Stump', category: 'utility' },
  'items_r4_c7': { name: 'Ancient Study Desk', category: 'utility' },
  'items_r4_c8': { name: 'Shadow Sprint', category: 'utility' },

  // === ROW 5: MELEE WEAPONS ===
  'items_r5_c0': { name: 'Wooden Club', category: 'weapon' },
  'items_r5_c1': { name: 'Iron Shortsword', category: 'weapon' },
  'items_r5_c2': { name: 'Steel Broadsword', category: 'weapon' },
  'items_r5_c3': { name: 'Silver Longsword', category: 'weapon' },
  'items_r5_c4': { name: 'Gladius Scimitar', category: 'weapon' },
  'items_r5_c5': { name: 'Corsair Cutlass', category: 'weapon' },
  'items_r5_c6': { name: 'Golden Rapier', category: 'weapon' },
  'items_r5_c7': { name: 'Assassin Kris Dagger', category: 'weapon' },
  'items_r5_c8': { name: 'Twin Parrying Sai', category: 'weapon' },
  'items_r5_c9': { name: 'Dual Daggers', category: 'weapon' },
  'items_r5_c10': { name: 'Woodsman Handaxe', category: 'weapon' },
  'items_r5_c11': { name: 'Executioner Battleaxe', category: 'weapon' },
  'items_r5_c12': { name: 'Iron Spiked Flail', category: 'weapon' },
  'items_r5_c13': { name: 'Barbed Morningstar', category: 'weapon' },
  'items_r5_c14': { name: 'Scourge Whip', category: 'weapon' },
  'items_r5_c15': { name: 'Spiked Cestus Fist', category: 'weapon' },

  // === ROW 6: SHIELDS, RANGED & STAVES ===
  'items_r6_c0': { name: 'Wooden Roundshield', category: 'armor' },
  'items_r6_c1': { name: 'Reinforced Kite Shield', category: 'armor' },
  'items_r6_c2': { name: 'Iron Tower Shield', category: 'armor' },
  'items_r6_c3': { name: 'Yew Shortbow', category: 'weapon' },
  'items_r6_c4': { name: 'Arbalest Crossbow', category: 'weapon' },
  'items_r6_c5': { name: 'Huntsman Slingshot', category: 'weapon' },
  'items_r6_c6': { name: 'Tribal Boomerang', category: 'weapon' },
  'items_r6_c7': { name: 'Oak Wizard Staff', category: 'weapon' },
  'items_r6_c8': { name: 'Apprentice Wand', category: 'weapon' },
  'items_r6_c9': { name: 'Pyromancer Torch Wand', category: 'weapon' },
  'items_r6_c10': { name: 'Emerald Sage Scepter', category: 'weapon' },
  'items_r6_c11': { name: 'Elder Archstaff', category: 'weapon' },

  // === ROW 7: HELMETS, ARMOR & CLOTHES ===
  'items_r7_c0': { name: 'Feathered Ranger Hat', category: 'armor' },
  'items_r7_c1': { name: 'Iron Soldier Helm', category: 'armor' },
  'items_r7_c2': { name: 'Crusader Greathelm', category: 'armor' },
  'items_r7_c3': { name: 'Visored Knight Helmet', category: 'armor' },
  'items_r7_c4': { name: 'Padded Gambeson', category: 'armor' },
  'items_r7_c5': { name: 'Steel Cuirass', category: 'armor' },
  'items_r7_c6': { name: 'Studded Leather Vest', category: 'armor' },
  'items_r7_c7': { name: 'Black Iron Platemail', category: 'armor' },
  'items_r7_c8': { name: 'Scholar Silk Robe (Blue)', category: 'armor' },
  'items_r7_c9': { name: 'Druid Wilderness Tunic', category: 'armor' },
  'items_r7_c10': { name: 'Reinforced Pants', category: 'armor' },
  'items_r7_c11': { name: 'Riveted Greaves', category: 'armor' },
  'items_r7_c12': { name: 'Lucky Boxer Shorts', category: 'armor' },
  'items_r7_c13': { name: 'Noble Maiden Gown', category: 'armor' },
  'items_r7_c14': { name: 'Shadow Cloak', category: 'armor' },
  'items_r7_c15': { name: 'Gilded Belt of Might', category: 'armor' },

  // === ROW 8: GLOVES, BOOTS, RINGS & AMULETS ===
  'items_r8_c0': { name: 'Leather Gloves', category: 'armor' },
  'items_r8_c1': { name: 'Steel Gauntlets', category: 'armor' },
  'items_r8_c2': { name: 'Traveler Leather Boots', category: 'armor' },
  'items_r8_c3': { name: 'Plated Armored Sabatons', category: 'armor' },
  'items_r8_c4': { name: 'Golden Band', category: 'armor' },
  'items_r8_c5': { name: 'Diamond Signet Ring', category: 'armor' },
  'items_r8_c6': { name: 'Golden Chain Necklace', category: 'armor' },
  'items_r8_c7': { name: 'Crimson Ruby Rosary', category: 'armor' },
  'items_r8_c8': { name: 'Dragon Tooth Talisman', category: 'armor' },
  'items_r8_c9': { name: 'Explorer Satchel', category: 'utility' },

  // === ROW 9: POTIONS, ELIXIRS & HEALING ===
  'items_r9_c0': { name: 'Health Flask (Minor)', category: 'potion' },
  'items_r9_c1': { name: 'Mana Flask (Minor)', category: 'potion' },
  'items_r9_c2': { name: 'Stamina Flask (Minor)', category: 'potion' },
  'items_r9_c3': { name: 'Energy Elixir (Minor)', category: 'potion' },
  'items_r9_c4': { name: 'Health Potion (Standard)', category: 'potion' },
  'items_r9_c5': { name: 'Mana Potion (Standard)', category: 'potion' },
  'items_r9_c6': { name: 'Venom Antidote', category: 'potion' },
  'items_r9_c7': { name: 'Strength Elixir', category: 'potion' },
  'items_r9_c8': { name: 'Greater Vitality Draught', category: 'potion' },
  'items_r9_c9': { name: 'Greater Arcane Draught', category: 'potion' },
  'items_r9_c10': { name: 'Greater Nature Draught', category: 'potion' },
  'items_r9_c11': { name: 'Greater Ambrosia Elixir', category: 'potion' },
  'items_r9_c12': { name: 'Healing Phial', category: 'potion' },
  'items_r9_c13': { name: 'Stamina Phial', category: 'potion' },
  'items_r9_c14': { name: 'Charm / Love Phial', category: 'potion' },
  'items_r9_c15': { name: 'Cloth Bandage Roll', category: 'utility' },

  // === ROW 10: TOOLS, SATCHELS & GADGETS ===
  'items_r10_c0': { name: 'Leather Pouch', category: 'utility' },
  'items_r10_c1': { name: 'Woodcutter Broadaxe', category: 'utility' },
  'items_r10_c2': { name: 'Miner Pickaxe', category: 'utility' },
  'items_r10_c3': { name: 'Iron Shovel', category: 'utility' },
  'items_r10_c4': { name: 'Forge Hammer', category: 'utility' },
  'items_r10_c5': { name: 'Throwing Tomahawk', category: 'weapon' },
  'items_r10_c6': { name: 'Hunting Harpoon', category: 'weapon' },
  'items_r10_c7': { name: 'Brass Spyglass', category: 'utility' },
  'items_r10_c8': { name: 'Magnifying Glass', category: 'utility' },
  'items_r10_c9': { name: 'Oil Lantern', category: 'utility' },
  'items_r10_c10': { name: 'Wood Torch', category: 'utility' },
  'items_r10_c11': { name: 'Wax Candle', category: 'utility' },
  'items_r10_c12': { name: 'Black Powder Bomb', category: 'weapon' },
  'items_r10_c13': { name: 'Climbing Rope', category: 'utility' },
  'items_r10_c14': { name: 'Venetian Mask', category: 'armor' },
  'items_r10_c15': { name: 'Chronos Hourglass', category: 'utility' },

  // === ROW 11: RELICS, KEYS & INSTRUMENTS ===
  'items_r11_c0': { name: 'Ancient Clay Tablet', category: 'material' },
  'items_r11_c1': { name: 'Silver Hand Mirror', category: 'utility' },
  'items_r11_c2': { name: 'Iron Shackles', category: 'utility' },
  'items_r11_c3': { name: 'Golden Lyre Harp', category: 'utility' },
  'items_r11_c4': { name: 'Bard Fiddle', category: 'utility' },
  'items_r11_c5': { name: 'Clay Ocarina', category: 'utility' },
  'items_r11_c6': { name: 'Wooden Flute', category: 'utility' },
  'items_r11_c7': { name: 'Bamboo Panpipes', category: 'utility' },
  'items_r11_c8': { name: 'Battle War Horn', category: 'utility' },
  'items_r11_c9': { name: 'Bronze Skeleton Key', category: 'utility' },
  'items_r11_c10': { name: 'Dungeon Keyring', category: 'utility' },
  'items_r11_c11': { name: 'Wooden Treasure Chest', category: 'utility' },
  'items_r11_c12': { name: 'Alchemist Mortar & Pestle', category: 'utility' },
  'items_r11_c13': { name: 'Healing Herb Sprig', category: 'material' },
  'items_r11_c14': { name: 'Autumn Maple Leaf', category: 'material' },
  'items_r11_c15': { name: 'Fern Foliage', category: 'material' },

  // === ROW 12: SOILS, PLANTS & CURRENCIES ===
  'items_r12_c0': { name: 'Fertile Soil', category: 'material' },
  'items_r12_c1': { name: 'Lotus Bloom', category: 'material' },
  'items_r12_c2': { name: 'Briar Root', category: 'material' },
  'items_r12_c3': { name: 'Potted Herb Seedling', category: 'material' },
  'items_r12_c4': { name: 'Green Sprout', category: 'material' },
  'items_r12_c5': { name: 'Bloomed Plant Pot', category: 'material' },
  'items_r12_c6': { name: 'Leather Seed Pouch', category: 'material' },
  'items_r12_c7': { name: 'Crown Gold Coin', category: 'material' },
  'items_r12_c8': { name: 'Bronze Coin Stack', category: 'material' },
  'items_r12_c9': { name: 'Silver Coin Stack', category: 'material' },
  'items_r12_c10': { name: 'Gold Coin Stack', category: 'material' },
  'items_r12_c11': { name: 'Heavy Gold Sack', category: 'material' },
  'items_r12_c12': { name: 'Scattered Gold Seeds', category: 'material' },
  'items_r12_c13': { name: 'Hand Bestowing Wealth', category: 'utility' },
  'items_r12_c14': { name: 'Frost Diamond Shards', category: 'material' },
  'items_r12_c15': { name: 'Flawless Blood Ruby', category: 'material' },

  // === ROW 13: SPELLBOOKS, SCROLLS & GAMES ===
  'items_r13_c0': { name: 'Tome of Water Magic', category: 'scroll' },
  'items_r13_c1': { name: 'Tome of Fire Magic', category: 'scroll' },
  'items_r13_c2': { name: 'Tome of Nature Magic', category: 'scroll' },
  'items_r13_c3': { name: 'Tome of Lightning Magic', category: 'scroll' },
  'items_r13_c4': { name: 'Necronomicon Grimoire', category: 'scroll' },
  'items_r13_c5': { name: 'Leatherbound Journal', category: 'scroll' },
  'items_r13_c6': { name: 'Star-Gilded Spellbook I', category: 'scroll' },
  'items_r13_c7': { name: 'Star-Gilded Spellbook II', category: 'scroll' },
  'items_r13_c8': { name: 'Open Arcane Manual', category: 'scroll' },
  'items_r13_c9': { name: 'Wax-Sealed Letter', category: 'scroll' },
  'items_r13_c10': { name: 'Ribbon Tied Scroll', category: 'scroll' },
  'items_r13_c11': { name: 'Royal Decree / Papyrus', category: 'scroll' },
  'items_r13_c12': { name: 'X-Marks Treasure Map', category: 'utility' },
  'items_r13_c13': { name: 'Pair of Bone Dice', category: 'utility' },
  'items_r13_c14': { name: 'Ace of Spades Card', category: 'utility' },
  'items_r13_c15': { name: 'Vintage Wine Bottle', category: 'food' },

  // === ROW 14: ORCHARD & CROPS ===
  'items_r14_c0': { name: 'Crisp Red Apple', category: 'food' },
  'items_r14_c1': { name: 'Ripe Banana', category: 'food' },
  'items_r14_c2': { name: 'Sweet Green Pear', category: 'food' },
  'items_r14_c3': { name: 'Sour Lemon', category: 'food' },
  'items_r14_c4': { name: 'Fresh Strawberry', category: 'food' },
  'items_r14_c5': { name: 'Cluster of Grapes', category: 'food' },
  'items_r14_c6': { name: 'Garden Carrot', category: 'food' },
  'items_r14_c7': { name: 'Ear of Sweetcorn', category: 'food' },
  'items_r14_c8': { name: 'Garlic Clove Bulb', category: 'food' },
  'items_r14_c9': { name: 'Plump Tomato', category: 'food' },
  'items_r14_c10': { name: 'Glossy Eggplant', category: 'food' },
  'items_r14_c11': { name: 'Spicy Chili Pepper', category: 'food' },
  'items_r14_c12': { name: 'Forest Portobello', category: 'food' },
  'items_r14_c13': { name: 'Rye Bread Loaf', category: 'food' },
  'items_r14_c14': { name: 'Crusty Baguette', category: 'food' },
  'items_r14_c15': { name: 'Roasted Whole Turkey', category: 'food' },

  // === ROW 15: MEATS, DAIRY & TREATS ===
  'items_r15_c0': { name: 'Roasted Drumstick', category: 'food' },
  'items_r15_c1': { name: 'Raw Marbled Steak', category: 'food' },
  'items_r15_c2': { name: 'Glazed Pork Ham', category: 'food' },
  'items_r15_c3': { name: 'Barbecue Ribs', category: 'food' },
  'items_r15_c4': { name: 'Grilled River Fish', category: 'food' },
  'items_r15_c5': { name: 'Basket of Farm Eggs', category: 'food' },
  'items_r15_c6': { name: 'Single Hardboiled Egg', category: 'food' },
  'items_r15_c7': { name: 'Swiss Cheese Wedge', category: 'food' },
  'items_r15_c8': { name: 'Glass Milk Bottle', category: 'food' },
  'items_r15_c9': { name: 'Clay Honey Jar', category: 'food' },
  'items_r15_c10': { name: 'Baking Flour Bowl', category: 'food' },
  'items_r15_c11': { name: 'Ground Spice Pile', category: 'food' },
  'items_r15_c12': { name: 'Wrapped Hard Candy', category: 'food' },
  'items_r15_c13': { name: 'Slice of Chocolate Cake', category: 'food' },
  'items_r15_c14': { name: 'Steaming Hot Coffee', category: 'food' },

  // === ROW 16: FISHING, AQUATICS & SEAFOOD ===
  'items_r16_c0': { name: 'Bamboo Fishing Rod', category: 'utility' },
  'items_r16_c1': { name: 'Steel Fish Hook', category: 'utility' },
  'items_r16_c2': { name: 'Wiggling Bait Worm', category: 'material' },
  'items_r16_c3': { name: 'Freshwater Bass', category: 'food' },
  'items_r16_c4': { name: 'Spotted River Trout', category: 'food' },
  'items_r16_c5': { name: 'Silver Sea Eel', category: 'food' },
  'items_r16_c6': { name: 'Golden Angelfish', category: 'food' },
  'items_r16_c7': { name: 'Orange Clownfish', category: 'food' },
  'items_r16_c8': { name: 'Translucent Blue Jellyfish', category: 'material' },
  'items_r16_c9': { name: 'Red Coral Octopus', category: 'food' },
  'items_r16_c10': { name: 'Sea Turtle Hatchling', category: 'material' },
  'items_r16_c11': { name: 'Fish Bone Remains', category: 'material' },
  'items_r16_c12': { name: 'Barnacle Covered Boots', category: 'armor' },
  'items_r16_c13': { name: 'Fossilized Ammonite', category: 'material' },
  'items_r16_c14': { name: 'Barnacle Sunken Chest', category: 'utility' },

  // === ROW 17: RAW MATERIALS & ORES ===
  'items_r17_c0': { name: 'Oak Wood Log', category: 'material' },
  'items_r17_c1': { name: 'Chiseled Stone Block', category: 'material' },
  'items_r17_c2': { name: 'Raw Crystal Ore', category: 'material' },
  'items_r17_c3': { name: 'Pure Gold Ingot', category: 'material' },
  'items_r17_c4': { name: 'Cut Sparkling Diamond', category: 'material' },
  'items_r17_c5': { name: 'Fluffy Cotton Boll', category: 'material' },
  'items_r17_c6': { name: 'Skein of Pink Yarn', category: 'material' },
  'items_r17_c7': { name: 'Folded Parchment Sheets', category: 'material' },
  'items_r17_c8': { name: 'Cured Animal Leather', category: 'material' },
  'items_r17_c9': { name: 'Demon Horn / Fang', category: 'material' },
  'items_r17_c10': { name: 'Snowy Owl Feather', category: 'material' },

  // === ROW 18: ELEMENTAL POWER ORBS ===
  'items_r18_c0': { name: 'Fire Heart Orb', category: 'material' },
  'items_r18_c1': { name: 'Tide Water Orb', category: 'material' },
  'items_r18_c2': { name: 'Life Nature Orb', category: 'material' },
  'items_r18_c3': { name: 'Storm Lightning Orb', category: 'material' },
  'items_r18_c4': { name: 'Shadow Abyss Orb', category: 'material' },
  'items_r18_c5': { name: 'Void Nether Orb', category: 'material' },

  // === ROW 19: FLASKS, CAULDRONS & MISC ===
  'items_r19_c0': { name: 'Empty Glass Flask', category: 'utility' },
  'items_r19_c1': { name: 'Empty Round Bottle', category: 'utility' },
  'items_r19_c2': { name: 'Empty Test Tube', category: 'utility' },
  'items_r19_c3': { name: 'Large Empty Decanter', category: 'utility' },
  'items_r19_c4': { name: 'Health Jug (Grand)', category: 'potion' },
  'items_r19_c5': { name: 'Mana Jug (Grand)', category: 'potion' },
  'items_r19_c6': { name: 'Venom Jug (Grand)', category: 'potion' },
  'items_r19_c7': { name: 'Stamina Jug (Grand)', category: 'potion' },
  'items_r19_c8': { name: 'Bubbling Stew Cauldron', category: 'utility' },
  'items_r19_c9': { name: 'Dark Magic Cauldron', category: 'utility' },
  'items_r19_c10': { name: 'Carved Chess Knight', category: 'utility' },
  'items_r19_c11': { name: 'Hewn Timber Plank', category: 'material' },

  // === ROW 20: ALCHEMICAL POWDERS ===
  'items_r20_c0': { name: 'Woven Reed Basket', category: 'utility' },
  'items_r20_c1': { name: 'Grave Dust Powder', category: 'material' },
  'items_r20_c2': { name: 'Arcane Stardust Powder', category: 'material' },
  'items_r20_c3': { name: 'Earthen Clay Powder', category: 'material' },
  'items_r20_c4': { name: 'Cinnabar Fire Dust', category: 'material' },
  'items_r20_c5': { name: 'Blood Ruby Powder', category: 'material' },
  'items_r20_c6': { name: 'Lapis Lazuli Powder', category: 'material' },
  'items_r20_c7': { name: 'Jade Crystal Dust', category: 'material' },
  'items_r20_c8': { name: 'Gilded Sun Powder', category: 'material' },
  'items_r20_c9': { name: 'Amethyst Shimmer Powder', category: 'material' },
  'items_r20_c10': { name: 'Viridian Poison Dust', category: 'material' },
  'items_r20_c11': { name: 'Moonstone Pearl Dust', category: 'material' },
  'items_r20_c12': { name: 'Silver Shimmer Dust', category: 'material' },

  // === ROW 21: SPELL SCROLLS & WEATHER RUNES ===
  'items_r21_c0': { name: 'Paladin Lay on Hands', category: 'status' },
  'items_r21_c1': { name: 'Ancient Scroll of Flame', category: 'scroll' },
  'items_r21_c2': { name: 'Ancient Scroll of Radiance', category: 'scroll' },
  'items_r21_c3': { name: 'Ancient Scroll of Frost', category: 'scroll' },
  'items_r21_c4': { name: 'Ancient Scroll of Stone', category: 'scroll' },
  'items_r21_c5': { name: 'Ancient Scroll of Gale', category: 'scroll' },
  'items_r21_c6': { name: 'Ancient Scroll of Mystery', category: 'scroll' },
  'items_r21_c7': { name: 'Dawn Sunrise Glyph', category: 'status' },
  'items_r21_c8': { name: 'Solar Noon Glyph', category: 'status' },
  'items_r21_c9': { name: 'Dusk Sunset Glyph', category: 'status' },
  'items_r21_c10': { name: 'Lunar Eclipse Glyph', category: 'status' },
  'items_r21_c11': { name: 'Blizzard Frost Rune', category: 'status' },
  'items_r21_c12': { name: 'Infernal Heatwave Rune', category: 'status' },
  'items_r21_c13': { name: 'Absolute Zero Rune', category: 'status' },

  // === BASIC MONSTERS SHEET ===
  'basic_r0_c0': { name: 'Watcher Eye', category: 'monster' },
  'basic_r0_c1': { name: 'Blood Gazer', category: 'monster' },
  'basic_r0_c2': { name: 'Bone Golem', category: 'monster' },
  'basic_r0_c3': { name: 'Frost Yeti', category: 'monster' },
  'basic_r0_c4': { name: 'Crimson Behemoth', category: 'monster' },
  'basic_r1_c0': { name: 'Cave Ogre', category: 'monster' },
  'basic_r1_c1': { name: 'Moss Troll', category: 'monster' },
  'basic_r1_c2': { name: 'One-Eyed Cyclops', category: 'monster' },
  'basic_r1_c3': { name: 'Hill Giant', category: 'monster' },
  'basic_r1_c4': { name: 'Twin-Headed Colossus', category: 'monster' },
  'basic_r2_c0': { name: 'Spore Sprout', category: 'monster' },
  'basic_r2_c1': { name: 'Red Cap Shroom', category: 'monster' },
  'basic_r2_c2': { name: 'Mycelium Brute', category: 'monster' },
  'basic_r2_c3': { name: 'Golden Slime', category: 'monster' },
  'basic_r2_c4': { name: 'Acid Ooze', category: 'monster' },

  // === DEMONS & FIENDS SHEET ===
  'demons_r0_c0': { name: 'Lesser Imp', category: 'monster' },
  'demons_r0_c1': { name: 'Hellfire Demon', category: 'monster' },
  'demons_r0_c2': { name: 'Winged Archdemon', category: 'monster' },
  'demons_r0_c3': { name: 'Void Eye Beast', category: 'monster' },
  'demons_r0_c4': { name: 'Infernal Succubus', category: 'monster' },
  'demons_r1_c0': { name: 'Shadow Imp', category: 'monster' },
  'demons_r1_c1': { name: 'Dusk Bat', category: 'monster' },
  'demons_r1_c2': { name: 'Nether Stalker', category: 'monster' },
  'demons_r1_c3': { name: 'Abyssal Brute', category: 'monster' },
  'demons_r1_c4': { name: 'Vampiric Dreadbat', category: 'monster' },
  'demons_r2_c0': { name: 'Toxic Hellseed', category: 'monster' },
  'demons_r2_c1': { name: 'Obsidian Guard', category: 'monster' },
  'demons_r2_c2': { name: 'Horned Netherlord', category: 'monster' },
  'demons_r2_c3': { name: 'Chaos Berserker', category: 'monster' },
  'demons_r2_c4': { name: 'Dark Necromancer', category: 'monster' },

  // === DRAGONS & WYRMS SHEET ===
  'dragons_r0_c0': { name: 'Emerald Wyrmling', category: 'monster' },
  'dragons_r0_c1': { name: 'Ancient Forest Dragon', category: 'monster' },
  'dragons_r0_c2': { name: 'Frost Hatchling', category: 'monster' },
  'dragons_r0_c3': { name: 'Glacial Drake', category: 'monster' },
  'dragons_r0_c4': { name: 'Crimson Flame Dragon', category: 'monster' },
  'dragons_r1_c0': { name: 'Sun Drake', category: 'monster' },
  'dragons_r1_c1': { name: 'Golden Wyrm', category: 'monster' },
  'dragons_r1_c2': { name: 'Amber Great Drake', category: 'monster' },
  'dragons_r1_c3': { name: 'Solar Leviathan', category: 'monster' },
  'dragons_r1_c4': { name: 'Amethyst Dragon', category: 'monster' },
  'dragons_r2_c0': { name: 'Swamp Pip', category: 'monster' },
  'dragons_r2_c1': { name: 'Earth Drake', category: 'monster' },
  'dragons_r2_c2': { name: 'Toxic Broodmother', category: 'monster' },
  'dragons_r2_c3': { name: 'Azure Storm Wyrm', category: 'monster' },
  'dragons_r2_c4': { name: 'Venomous Dragon King', category: 'monster' },

  // === HUMANOIDS & HEROES SHEET ===
  'humanoids_r0_c0': { name: 'Elven Ranger', category: 'hero' },
  'humanoids_r0_c1': { name: 'High Elf Marksman', category: 'hero' },
  'humanoids_r0_c2': { name: 'Arcane Mage', category: 'hero' },
  'humanoids_r0_c3': { name: 'Spellblade Paladin', category: 'hero' },
  'humanoids_r0_c4': { name: 'Viking Berserker', category: 'hero' },
  'humanoids_r1_c0': { name: 'Tide Hunter Naga', category: 'monster' },
  'humanoids_r1_c1': { name: 'Sunken Siren', category: 'monster' },
  'humanoids_r1_c2': { name: 'Abyssal Spearman', category: 'monster' },
  'humanoids_r1_c3': { name: 'Trident Warlord', category: 'monster' },
  'humanoids_r1_c4': { name: 'Coral Shaman', category: 'monster' },
  'humanoids_r2_c0': { name: 'Novice Adventurer', category: 'hero' },
  'humanoids_r2_c1': { name: 'Shadow Scout', category: 'hero' },
  'humanoids_r2_c2': { name: 'Travelling Merchant', category: 'hero' },
  'humanoids_r2_c3': { name: 'High Priestess', category: 'hero' },
  'humanoids_r2_c4': { name: 'Grandmaster Wizard', category: 'hero' }
};

class SpriteStudio {
  constructor() {
    this.sprites = [];
    this.activeSheet = 'all';
    this.activeFilter = 'all';
    this.searchQuery = '';
    this.savedData = this.loadSavedData();

    this.cacheDom();
    this.bindEvents();
    this.sliceAllSheets();
  }

  loadSavedData() {
    try {
      const raw = localStorage.getItem('aegis_custom_sprites');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  saveData() {
    const manifest = {};
    for (const s of this.sprites) {
      manifest[s.id] = {
        name: s.name,
        category: s.category,
        sheet: s.sheet,
        row: s.row,
        col: s.col,
        dataUrl: s.dataUrl
      };
    }
    localStorage.setItem('aegis_custom_sprites', JSON.stringify(manifest));
  }

  cacheDom() {
    this.dom = {
      sheetTabs: document.getElementById('sheet-tabs'),
      totalSliceCount: document.getElementById('total-slice-count'),
      statTotalSprites: document.getElementById('stat-total-sprites'),
      statNamedSprites: document.getElementById('stat-named-sprites'),
      statCustomCount: document.getElementById('stat-custom-count'),
      spriteSearch: document.getElementById('sprite-search'),
      categoryChips: document.querySelectorAll('.chip'),
      galleryCounter: document.getElementById('gallery-counter'),
      zoomSlider: document.getElementById('zoom-slider'),
      spritesGrid: document.getElementById('sprites-grid'),
      btnAutoNameAll: document.getElementById('btn-auto-name-all'),
      btnExportJson: document.getElementById('btn-export-json'),
      btnApplyToGame: document.getElementById('btn-apply-to-game'),
      modalOverlay: document.getElementById('editor-modal-overlay'),
      modalContent: document.getElementById('editor-modal-content')
    };
  }

  bindEvents() {
    this.dom.sheetTabs.querySelectorAll('.sheet-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.dom.sheetTabs.querySelectorAll('.sheet-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSheet = btn.dataset.sheet;
        this.renderGallery();
      });
    });

    this.dom.categoryChips.forEach(chip => {
      chip.addEventListener('click', () => {
        this.dom.categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.activeFilter = chip.dataset.filter;
        this.renderGallery();
      });
    });

    this.dom.spriteSearch.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderGallery();
    });

    this.dom.zoomSlider.addEventListener('input', (e) => {
      const sz = e.target.value;
      document.querySelectorAll('.sprite-preview-img').forEach(img => {
        img.style.width = `${sz}px`;
        img.style.height = `${sz}px`;
      });
    });

    this.dom.btnAutoNameAll.addEventListener('click', () => {
      this.applySmartAutoNames();
      this.saveData();
      this.renderGallery();
      alert('✨ Smart preset names applied to all recognized sprites!');
    });

    this.dom.btnExportJson.addEventListener('click', () => {
      this.openExportModal();
    });

    this.dom.btnApplyToGame.addEventListener('click', () => {
      this.saveData();
      alert('⚡ Custom sprite names and art manifest have been synced to the RPG game!');
    });

    this.dom.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.dom.modalOverlay) {
        this.dom.modalOverlay.classList.add('hidden');
      }
    });
  }

  async sliceAllSheets() {
    this.sprites = [];

    for (const sheetDef of SPRITE_SHEETS) {
      await this.sliceSheet(sheetDef);
    }

    this.updateStats();
    this.renderGallery();
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });
  }

  async sliceSheet(sheetDef) {
    try {
      const img = await this.loadImage(sheetDef.path);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (sheetDef.type === 'grid') {
        const tileSize = sheetDef.tileSize || 32;
        const cols = Math.floor(img.width / tileSize);
        const rows = Math.floor(img.height / tileSize);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            canvas.width = tileSize;
            canvas.height = tileSize;
            ctx.clearRect(0, 0, tileSize, tileSize);
            ctx.drawImage(img, c * tileSize, r * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);

            const imgData = ctx.getImageData(0, 0, tileSize, tileSize);
            if (this.isCellNonEmpty(imgData)) {
              const id = `${sheetDef.id}_r${r}_c${c}`;
              const saved = this.savedData[id] || {};
              const preset = PRESET_NAMES[id] || { name: `Icon R${r + 1}:C${c + 1}`, category: 'item' };

              this.sprites.push({
                id,
                sheet: sheetDef.id,
                sheetName: sheetDef.name,
                row: r,
                col: c,
                dataUrl: canvas.toDataURL('image/png'),
                name: saved.name || preset.name,
                category: saved.category || preset.category
              });
            }
          }
        }
      } else {
        const tileWidth = Math.floor(img.width / sheetDef.cols);
        const tileHeight = Math.floor(img.height / sheetDef.rows);

        for (let r = 0; r < sheetDef.rows; r++) {
          for (let c = 0; c < sheetDef.cols; c++) {
            canvas.width = tileWidth;
            canvas.height = tileHeight;
            ctx.clearRect(0, 0, tileWidth, tileHeight);
            ctx.drawImage(img, c * tileWidth, r * tileHeight, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);

            const id = `${sheetDef.id}_r${r}_c${c}`;
            const saved = this.savedData[id] || {};
            const preset = PRESET_NAMES[id] || { name: `${sheetDef.name} #${r * sheetDef.cols + c + 1}`, category: sheetDef.categoryDefault };

            this.sprites.push({
              id,
              sheet: sheetDef.id,
              sheetName: sheetDef.name,
              row: r,
              col: c,
              dataUrl: canvas.toDataURL('image/png'),
              name: saved.name || preset.name,
              category: saved.category || preset.category
            });
          }
        }
      }
    } catch (e) {
      console.warn(`Could not load sheet: ${sheetDef.path}`, e);
    }
  }

  isCellNonEmpty(imgData) {
    const data = imgData.data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 20) return true;
    }
    return false;
  }

  applySmartAutoNames() {
    for (const s of this.sprites) {
      if (PRESET_NAMES[s.id]) {
        s.name = PRESET_NAMES[s.id].name;
        s.category = PRESET_NAMES[s.id].category;
      }
    }
  }

  updateStats() {
    this.dom.totalSliceCount.textContent = this.sprites.length;
    this.dom.statTotalSprites.textContent = this.sprites.length;
    this.dom.statNamedSprites.textContent = this.sprites.filter(s => s.name && !s.name.startsWith('Icon')).length;
    this.dom.statCustomCount.textContent = Object.keys(this.savedData).length;
  }

  renderGallery() {
    this.updateStats();

    const filtered = this.sprites.filter(s => {
      const matchSheet = this.activeSheet === 'all' || s.sheet === this.activeSheet;
      const matchCategory = this.activeFilter === 'all' || s.category === this.activeFilter;
      const matchSearch = !this.searchQuery || s.name.toLowerCase().includes(this.searchQuery) || s.category.toLowerCase().includes(this.searchQuery);
      return matchSheet && matchCategory && matchSearch;
    });

    this.dom.galleryCounter.textContent = `Showing ${filtered.length} of ${this.sprites.length} sprites`;

    if (filtered.length === 0) {
      this.dom.spritesGrid.innerHTML = `
        <div class="loading-state">
          <div style="font-size: 32px;">🔍</div>
          <span>No matching sprites found. Try adjusting your search query or filters.</span>
        </div>
      `;
      return;
    }

    const currentZoom = this.dom.zoomSlider.value;
    let html = '';

    for (let i = 0; i < filtered.length; i++) {
      const s = filtered[i];
      html += `
        <div class="sprite-card" data-id="${s.id}">
          <div class="sprite-preview-wrap">
            <span class="sprite-source-tag">${s.sheetName}</span>
            <span class="sprite-category-badge">${s.category.toUpperCase()}</span>
            <img src="${s.dataUrl}" class="sprite-preview-img" style="width: ${currentZoom}px; height: ${currentZoom}px;" alt="${s.name}">
          </div>
          <div class="sprite-fields">
            <input type="text" class="sprite-name-input" data-id="${s.id}" value="${s.name}" placeholder="Enter sprite name...">
            <div class="sprite-meta-row">
              <span>Category:</span>
              <select class="sprite-type-select" data-id="${s.id}">
                <option value="weapon" ${s.category === 'weapon' ? 'selected' : ''}>Weapon</option>
                <option value="armor" ${s.category === 'armor' ? 'selected' : ''}>Armor</option>
                <option value="potion" ${s.category === 'potion' ? 'selected' : ''}>Potion</option>
                <option value="monster" ${s.category === 'monster' ? 'selected' : ''}>Monster</option>
                <option value="hero" ${s.category === 'hero' ? 'selected' : ''}>Hero</option>
                <option value="material" ${s.category === 'material' ? 'selected' : ''}>Material</option>
                <option value="scroll" ${s.category === 'scroll' ? 'selected' : ''}>Scroll</option>
                <option value="food" ${s.category === 'food' ? 'selected' : ''}>Food</option>
                <option value="utility" ${s.category === 'utility' ? 'selected' : ''}>Utility</option>
                <option value="status" ${s.category === 'status' ? 'selected' : ''}>Status / Rune</option>
                <option value="item" ${s.category === 'item' ? 'selected' : ''}>General Item</option>
              </select>
            </div>
          </div>
        </div>
      `;
    }

    this.dom.spritesGrid.innerHTML = html;

    this.dom.spritesGrid.querySelectorAll('.sprite-name-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = input.dataset.id;
        const sprite = this.sprites.find(s => s.id === id);
        if (sprite) {
          sprite.name = e.target.value.trim() || 'Unnamed';
          this.savedData[id] = { name: sprite.name, category: sprite.category };
          this.saveData();
          this.updateStats();
        }
      });
    });

    this.dom.spritesGrid.querySelectorAll('.sprite-type-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = select.dataset.id;
        const sprite = this.sprites.find(s => s.id === id);
        if (sprite) {
          sprite.category = e.target.value;
          this.savedData[id] = { name: sprite.name, category: sprite.category };
          this.saveData();
          this.renderGallery();
        }
      });
    });
  }

  openExportModal() {
    const exportObj = {};
    for (const s of this.sprites) {
      exportObj[s.id] = {
        name: s.name,
        category: s.category,
        sheet: s.sheet,
        row: s.row,
        col: s.col,
        dataUrl: s.dataUrl
      };
    }

    const jsonStr = JSON.stringify(exportObj, null, 2);

    this.dom.modalContent.innerHTML = `
      <h3 style="margin-bottom: 8px; color: #fff;">[EXPORT] Sliced Sprites Manifest (JSON)</h3>
      <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">Includes all sliced canvas PNG data URLs, coordinates, custom names, and categories.</p>
      
      <textarea id="export-json-area" style="width: 100%; height: 260px; background: #0b0f19; border: 1px solid #334155; border-radius: 6px; color: #38bdf8; font-family: monospace; font-size: 10px; padding: 10px; resize: vertical;">${jsonStr}</textarea>

      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px;">
        <button id="btn-copy-json" class="btn btn-primary btn-sm">Copy JSON to Clipboard</button>
        <button id="btn-download-json" class="btn btn-accent btn-sm">Download JSON File</button>
        <button id="btn-close-modal" class="btn btn-outline btn-sm">Close</button>
      </div>
    `;

    this.dom.modalOverlay.classList.remove('hidden');

    document.getElementById('btn-copy-json').addEventListener('click', () => {
      const area = document.getElementById('export-json-area');
      area.select();
      navigator.clipboard.writeText(area.value);
      alert('JSON copied to clipboard!');
    });

    document.getElementById('btn-download-json').addEventListener('click', () => {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aegis_sprites_manifest.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('btn-close-modal').addEventListener('click', () => {
      this.dom.modalOverlay.classList.add('hidden');
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SpriteStudio();
});
