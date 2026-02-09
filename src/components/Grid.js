/**
 * Grid - Manages the 8x8 match-3 grid
 * Contains gems and handles grid-level operations
 */
import { Gem } from './Gem.js';
import { GemType } from '../config/game-config.js';

export class Grid {
  constructor(width = 8, height = 8) {
    this.width = width;
    this.height = height;
    this.gems = []; // 2D array [x][y]
    this.selectedGem = null;
    this.isAnimating = false;
    this.pendingMatches = [];
    
    this.initializeGrid();
  }

  initializeGrid() {
    // Create empty grid
    this.gems = [];
    for (let x = 0; x < this.width; x++) {
      this.gems[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.gems[x][y] = null;
      }
    }

    // Fill with random gems (ensuring no initial matches)
    this.fillGridWithoutMatches();
  }

  fillGridWithoutMatches() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let type;
        do {
          type = this.getRandomGemType();
        } while (this.wouldCreateMatch(x, y, type));
        
        this.gems[x][y] = new Gem(x, y, type);
      }
    }
  }

  getRandomGemType() {
    return Math.floor(Math.random() * 6); // 0-5
  }

  wouldCreateMatch(x, y, type) {
    // Check horizontal
    let horizontalCount = 1;
    // Check left
    for (let i = x - 1; i >= 0 && this.gems[i][y]?.type === type; i--) {
      horizontalCount++;
    }
    // Check right
    for (let i = x + 1; i < this.width && this.gems[i][y]?.type === type; i++) {
      horizontalCount++;
    }
    if (horizontalCount >= 3) return true;

    // Check vertical
    let verticalCount = 1;
    // Check up
    for (let i = y - 1; i >= 0 && this.gems[x][i]?.type === type; i--) {
      verticalCount++;
    }
    // Check down
    for (let i = y + 1; i < this.height && this.gems[x][i]?.type === type; i++) {
      verticalCount++;
    }
    if (verticalCount >= 3) return true;

    return false;
  }

  getGem(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return null;
    }
    return this.gems[x][y];
  }

  setGem(x, y, gem) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }
    this.gems[x][y] = gem;
    if (gem) {
      gem.setGridPosition(x, y);
    }
  }

  // Swap two gems
  swapGems(gem1, gem2) {
    if (!gem1 || !gem2) return false;
    if (!gem1.isAdjacentTo(gem2)) return false;

    const x1 = gem1.gridX;
    const y1 = gem1.gridY;
    const x2 = gem2.gridX;
    const y2 = gem2.gridY;

    // Swap in grid
    this.gems[x1][y1] = gem2;
    this.gems[x2][y2] = gem1;

    // Update gem positions
    gem1.setGridPosition(x2, y2);
    gem2.setGridPosition(x1, y1);

    return true;
  }

  // Try swap and check if it creates matches
  trySwap(gem1, gem2) {
    // Perform swap
    this.swapGems(gem1, gem2);

    // Check for matches
    const matches = this.findMatches();

    if (matches.length === 0) {
      // No matches, swap back
      this.swapGems(gem1, gem2);
      return false;
    }

    return true;
  }

  // Find all matches on the grid
  findMatches() {
    const matches = [];
    const matchedGems = new Set();

    // Check horizontal matches
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width - 2; x++) {
        const gem1 = this.gems[x][y];
        const gem2 = this.gems[x + 1][y];
        const gem3 = this.gems[x + 2][y];

        if (gem1 && gem2 && gem3 && 
            gem1.type === gem2.type && 
            gem2.type === gem3.type) {
          
          // Find full match length
          let matchLength = 3;
          for (let i = x + 3; i < this.width && this.gems[i][y]?.type === gem1.type; i++) {
            matchLength++;
          }

          // Add gems to match
          const match = {
            type: 'horizontal',
            gemType: gem1.type,
            gems: [],
            startX: x,
            startY: y,
            length: matchLength
          };

          for (let i = x; i < x + matchLength; i++) {
            const gem = this.gems[i][y];
            if (!matchedGems.has(gem)) {
              match.gems.push(gem);
              matchedGems.add(gem);
            }
          }

          matches.push(match);
          x += matchLength - 1; // Skip ahead
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height - 2; y++) {
        const gem1 = this.gems[x][y];
        const gem2 = this.gems[x][y + 1];
        const gem3 = this.gems[x][y + 2];

        if (gem1 && gem2 && gem3 && 
            gem1.type === gem2.type && 
            gem2.type === gem3.type) {
          
          // Find full match length
          let matchLength = 3;
          for (let i = y + 3; i < this.height && this.gems[x][i]?.type === gem1.type; i++) {
            matchLength++;
          }

          // Add gems to match
          const match = {
            type: 'vertical',
            gemType: gem1.type,
            gems: [],
            startX: x,
            startY: y,
            length: matchLength
          };

          for (let i = y; i < y + matchLength; i++) {
            const gem = this.gems[x][i];
            if (!matchedGems.has(gem)) {
              match.gems.push(gem);
              matchedGems.add(gem);
            }
          }

          matches.push(match);
          y += matchLength - 1; // Skip ahead
        }
      }
    }

    return matches;
  }

  // Remove matched gems and apply gravity
  removeMatches(matches) {
    const removedGems = [];

    // Mark gems as removed
    for (const match of matches) {
      for (const gem of match.gems) {
        gem.isMatched = true;
        removedGems.push(gem);
      }
    }

    // Remove from grid after a short delay (for animation)
    setTimeout(() => {
      for (const gem of removedGems) {
        const x = gem.gridX;
        const y = gem.gridY;
        this.gems[x][y] = null;
        gem.destroy();
      }

      // Apply gravity
      this.applyGravity();
    }, 200);

    return removedGems;
  }

  // Apply gravity to make gems fall
  applyGravity() {
    let gemsFell = false;

    for (let x = 0; x < this.width; x++) {
      let writeY = this.height - 1;

      for (let y = this.height - 1; y >= 0; y--) {
        if (this.gems[x][y] !== null) {
          if (writeY !== y) {
            // Move gem down
            this.gems[x][writeY] = this.gems[x][y];
            this.gems[x][y] = null;
            this.gems[x][writeY].setGridPosition(x, writeY);
            this.gems[x][writeY].isFalling = true;
            gemsFell = true;
          }
          writeY--;
        }
      }

      // Fill empty spaces at top with new gems
      for (let y = writeY; y >= 0; y--) {
        const type = this.getRandomGemType();
        const gem = new Gem(x, y, type);
        gem.y = -100; // Start above the grid
        gem.isFalling = true;
        this.gems[x][y] = gem;
        gemsFell = true;
      }
    }

    return gemsFell;
  }

  // Create special gems from matches
  createSpecialGems(matches) {
    for (const match of matches) {
      if (match.length === 4) {
        // Create line-clearing gem
        const centerGem = match.gems[Math.floor(match.gems.length / 2)];
        const specialType = match.type === 'horizontal' ? 'line_horizontal' : 'line_vertical';
        
        // Keep the center gem and make it special
        for (const gem of match.gems) {
          if (gem !== centerGem) {
            gem.isMatched = true;
          }
        }
        centerGem.makeSpecial(specialType);
        centerGem.isMatched = false;
      } else if (match.length >= 5) {
        // Create rainbow gem
        const centerGem = match.gems[Math.floor(match.gems.length / 2)];
        
        for (const gem of match.gems) {
          if (gem !== centerGem) {
            gem.isMatched = true;
          }
        }
        centerGem.makeSpecial('rainbow');
        centerGem.isMatched = false;
      }
    }
  }

  // Get all gems as flat array
  getAllGems() {
    const gems = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.gems[x][y]) {
          gems.push(this.gems[x][y]);
        }
      }
    }
    return gems;
  }

  // Check if there are any valid moves
  hasValidMoves() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const gem = this.gems[x][y];
        if (!gem) continue;

        // Check right neighbor
        if (x < this.width - 1) {
          const rightGem = this.gems[x + 1][y];
          if (this.wouldMatchIfSwapped(gem, rightGem)) {
            return true;
          }
        }

        // Check bottom neighbor
        if (y < this.height - 1) {
          const bottomGem = this.gems[x][y + 1];
          if (this.wouldMatchIfSwapped(gem, bottomGem)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  wouldMatchIfSwapped(gem1, gem2) {
    // Temporarily swap
    const x1 = gem1.gridX, y1 = gem1.gridY;
    const x2 = gem2.gridX, y2 = gem2.gridY;

    this.gems[x1][y1] = gem2;
    this.gems[x2][y2] = gem1;

    const matches = this.findMatches();

    // Swap back
    this.gems[x1][y1] = gem1;
    this.gems[x2][y2] = gem2;

    return matches.length > 0;
  }

  // Get gem at pixel position
  getGemAtPixel(x, y) {
    const gridPos = Gem.pixelToGrid(x, y);
    return this.getGem(gridPos.x, gridPos.y);
  }

  update(deltaTime) {
    for (const gem of this.getAllGems()) {
      gem.update(deltaTime);
    }
  }

  render(ctx) {
    // Render all gems
    for (const gem of this.getAllGems()) {
      gem.render(ctx);
    }

    // Render selection highlight
    if (this.selectedGem) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.strokeRect(
        this.selectedGem.x - 2,
        this.selectedGem.y - 2,
        this.selectedGem.width + 4,
        this.selectedGem.height + 4
      );
    }
  }
}
