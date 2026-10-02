// ============================================================================
// AEGIS ENDLESS - PIXEL ART SPRITE & ICON RENDER ENGINE
// ============================================================================

export const SPRITE_SHEET_PATHS = {
  ITEMS: 'art/items/%231%20-%20Transparent%20Icons.png',
  BASIC_MONSTERS: 'art/sprites/Basic%204x.png',
  DEMONS: 'art/sprites/Basic%20Demons%204x.png',
  DRAGONS: 'art/sprites/Basic%20Dragon%204x.png',
  HUMANOIDS: 'art/sprites/Basic%20Humanoid%20II%204x.png'
};

const DEFAULT_SLOT_SPRITES = {
  mainHand: { r: 5, c: 2 },
  offHand: { r: 6, c: 0 },
  helmet: { r: 7, c: 0 },
  chest: { r: 7, c: 4 },
  boots: { r: 8, c: 2 },
  ring1: { r: 8, c: 4 },
  ring2: { r: 8, c: 5 },
  amulet: { r: 8, c: 8 }
};

/**
 * Returns HTML element string for a 32x32 transparent item icon
 * @param {object} itemOrSprite - { r: number, c: number } or Item object
 * @param {number} size - display size in px (default 32)
 */
export function renderItemIcon(itemOrSprite, size = 32) {
  if (!itemOrSprite) return '';

  let sprite = itemOrSprite.sprite || itemOrSprite;

  // Fallback to slot defaults if r or c missing
  if (sprite.r === undefined || sprite.c === undefined) {
    if (itemOrSprite.type && DEFAULT_SLOT_SPRITES[itemOrSprite.type]) {
      sprite = DEFAULT_SLOT_SPRITES[itemOrSprite.type];
    } else {
      sprite = { r: 5, c: 2 }; // Default iron blade icon
    }
  }

  const posX = -(sprite.c * 32);
  const posY = -(sprite.r * 32);
  const scale = size / 32;
  const sheetWidth = 512 * scale; // 16 cols * 32 = 512 base

  return `
    <div class="pixel-art-icon" style="
      width: ${size}px;
      height: ${size}px;
      background-image: url('${SPRITE_SHEET_PATHS.ITEMS}');
      background-position: ${posX * scale}px ${posY * scale}px;
      background-size: ${sheetWidth}px auto;
      background-repeat: no-repeat;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      display: inline-block;
      flex-shrink: 0;
      pointer-events: none;
    "></div>
  `;
}

/**
 * Returns HTML element string for a monster or hero fighter sprite
 * @param {object} fighter - { sheet: string, r: number, c: number } or Entity
 * @param {number} size - display width in px (default 88)
 */
export function renderFighterSprite(fighter, size = 88) {
  if (!fighter) return '';

  const sprite = fighter.sprite || fighter;
  if (!sprite || !sprite.sheet || sprite.r === undefined || sprite.c === undefined) {
    return `
      <div class="pixel-art-fighter" style="
        width: ${size}px;
        height: ${size}px;
        background-image: url('${SPRITE_SHEET_PATHS.BASIC_MONSTERS}');
        background-position: 0% 0%;
        background-size: 500% 300%;
        background-repeat: no-repeat;
        image-rendering: pixelated;
        image-rendering: crisp-edges;
        filter: drop-shadow(0 10px 16px rgba(0,0,0,0.85));
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      "></div>
    `;
  }

  const sheetPath = SPRITE_SHEET_PATHS[sprite.sheet] || SPRITE_SHEET_PATHS.BASIC_MONSTERS;
  const posX = sprite.c * 25; // 0%, 25%, 50%, 75%, 100% across 5 cols
  const posY = sprite.r * 50; // 0%, 50%, 100% across 3 rows
  const isBoss = !!fighter.isBoss;

  return `
    <div class="pixel-art-fighter ${isBoss ? 'boss-fighter-sprite' : ''}" style="
      width: ${size}px;
      height: ${size}px;
      background-image: url('${sheetPath}');
      background-position: ${posX}% ${posY}%;
      background-size: 500% 300%;
      background-repeat: no-repeat;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
      filter: drop-shadow(0 10px 16px rgba(0,0,0,0.85)) ${isBoss ? 'drop-shadow(0 0 12px rgba(220, 38, 38, 0.6))' : ''};
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    "></div>
  `;
}

