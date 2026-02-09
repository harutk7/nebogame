/**
 * Game Configuration
 * Central configuration for all game settings
 */

export const GAME_CONFIG = {
  // Grid settings
  GRID: {
    WIDTH: 8,
    HEIGHT: 8,
    TILE_SIZE: 60,
    GEM_TYPES: 6,
  },
  
  // Canvas settings
  CANVAS: {
    WIDTH: 480,
    HEIGHT: 854,
    BACKGROUND_COLOR: '#060412',
  },
  
  // Game settings
  GAME: {
    FPS: 60,
    COMBO_TIMEOUT: 2000,
    TURN_TIME_LIMIT: 30000,
  },
  
  // Gem colors (matching original game)
  GEMS: {
    RED: '#FF4444',      // Fire
    BLUE: '#4444FF',     // Water
    GREEN: '#44FF44',    // Nature
    YELLOW: '#FFFF44',   // Light
    PURPLE: '#FF44FF',   // Dark
    WHITE: '#FFFFFF',    // Neutral
  },
  
  // Player settings
  PLAYER: {
    BASE_HP: 500,
    BASE_ATTACK: 10,
    BASE_DEFENSE: 0,
  },
};

export default GAME_CONFIG;
