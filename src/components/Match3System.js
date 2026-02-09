/**
 * Match3System - Orchestrates the match-3 gameplay flow
 * Handles player input, match processing, and combo chains
 */
import { Grid } from './Grid.js';

export class Match3System {
  constructor() {
    this.grid = new Grid(8, 8);
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isProcessing = false;
    this.onMatch = null; // Callback for match events
    this.onCombo = null; // Callback for combo events
    this.onMoveComplete = null; // Callback when move finishes
  }

  // Handle player selecting a gem
  selectGem(gem) {
    if (this.isProcessing) return false;
    if (!gem) return false;

    // First selection
    if (!this.grid.selectedGem) {
      this.grid.selectedGem = gem;
      return true;
    }

    // Same gem clicked - deselect
    if (this.grid.selectedGem === gem) {
      this.grid.selectedGem = null;
      return true;
    }

    // Try to swap with selected gem
    return this.trySwap(this.grid.selectedGem, gem);
  }

  // Try to swap two gems
  async trySwap(gem1, gem2) {
    if (this.isProcessing) return false;

    // Check if swap is valid
    if (!gem1.isAdjacentTo(gem2)) {
      // Not adjacent - just select the new gem
      this.grid.selectedGem = gem2;
      return false;
    }

    this.isProcessing = true;

    // Perform the swap
    const success = this.grid.trySwap(gem1, gem2);

    if (success) {
      // Reset selection
      this.grid.selectedGem = null;

      // Process matches
      await this.processMatches();

      if (this.onMoveComplete) {
        this.onMoveComplete();
      }
    } else {
      // Invalid move - just select the second gem
      this.grid.selectedGem = gem2;
    }

    this.isProcessing = false;
    return success;
  }

  // Process matches and combos
  async processMatches() {
    let hasMatches = true;
    let comboCount = 0;

    while (hasMatches && comboCount < 10) { // Max 10 combo depth
      const matches = this.grid.findMatches();

      if (matches.length === 0) {
        hasMatches = false;
        break;
      }

      comboCount++;
      this.combo = comboCount;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // Calculate score
      let matchScore = 0;
      for (const match of matches) {
        matchScore += match.gems.length * 10 * comboCount;
      }
      this.score += matchScore;

      // Fire callbacks
      if (this.onMatch) {
        this.onMatch(matches, matchScore, comboCount);
      }

      if (comboCount > 1 && this.onCombo) {
        this.onCombo(comboCount);
      }

      // Create special gems
      this.grid.createSpecialGems(matches);

      // Remove matched gems
      this.grid.removeMatches(matches);

      // Wait for removal animation
      await this.wait(300);

      // Apply gravity
      this.grid.applyGravity();

      // Wait for falling animation
      await this.wait(500);
    }

    this.combo = 0;

    // Check if there are valid moves left
    if (!this.grid.hasValidMoves()) {
      // Shuffle the grid
      this.shuffleGrid();
    }
  }

  // Shuffle the grid when no valid moves exist
  shuffleGrid() {
    const gems = this.grid.getAllGems();
    
    // Fisher-Yates shuffle
    for (let i = gems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gems[i], gems[j]] = [gems[j], gems[i]];
    }

    // Reassign to grid
    let index = 0;
    for (let x = 0; x < this.grid.width; x++) {
      for (let y = 0; y < this.grid.height; y++) {
        this.grid.gems[x][y] = gems[index++];
        this.grid.gems[x][y].setGridPosition(x, y);
      }
    }

    // Check for matches after shuffle
    const matches = this.grid.findMatches();
    if (matches.length > 0) {
      this.processMatches();
    }
  }

  // Wait helper for animations
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Reset the game
  reset() {
    this.grid.initializeGrid();
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.isProcessing = false;
  }

  // Get current game state
  getState() {
    return {
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      isProcessing: this.isProcessing,
      hasValidMoves: this.grid.hasValidMoves()
    };
  }

  update(deltaTime) {
    this.grid.update(deltaTime);
  }

  render(ctx) {
    this.grid.render(ctx);
  }
}
