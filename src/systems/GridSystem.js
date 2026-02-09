/**
 * GridSystem - System that updates all grid entities
 * Integrates with the EntityManager from Task #2
 */

import { Match3System } from '../components/Match3System.js';

export class GridSystem {
  constructor(entityManager, inputManager) {
    this.entityManager = entityManager;
    this.inputManager = inputManager;
    this.match3System = new Match3System();
    this.isInitialized = false;
    
    // Bind input handlers
    this.setupInputHandlers();
  }

  setupInputHandlers() {
    if (!this.inputManager) return;

    this.inputManager.on('mousedown', (event) => this.handleInput(event));
    this.inputManager.on('touchstart', (event) => this.handleInput(event));
    this.inputManager.on('click', (event) => this.handleInput(event));
  }

  handleInput(event) {
    if (this.match3System.isProcessing) return;

    const gem = this.match3System.grid.getGemAtPixel(event.x, event.y);
    if (gem) {
      this.match3System.selectGem(gem);
    }
  }

  init() {
    // Register all grid gems with the entity manager
    this.updateEntityManager();
    this.isInitialized = true;
  }

  updateEntityManager() {
    if (!this.entityManager) return;

    // Remove old gem entities
    const oldGems = this.entityManager.getEntitiesByTag('gem');
    for (const gem of oldGems) {
      this.entityManager.removeEntity(gem);
    }

    // Add current grid gems
    const gems = this.match3System.grid.getAllGems();
    for (const gem of gems) {
      gem.addTag('gem');
      this.entityManager.addEntity(gem);
    }
  }

  update(deltaTime) {
    // Update the match3 system (handles gem animations, etc.)
    this.match3System.update(deltaTime);
    
    // Sync with entity manager if needed
    if (this.entityManager) {
      this.updateEntityManager();
    }
  }

  render(ctx) {
    this.match3System.render(ctx);
  }

  // Get the current score
  getScore() {
    return this.match3System.score;
  }

  // Get the current combo
  getCombo() {
    return this.match3System.combo;
  }

  // Reset the grid
  reset() {
    this.match3System.reset();
    this.updateEntityManager();
  }

  // Set callback for match events
  onMatch(callback) {
    this.match3System.onMatch = callback;
  }

  // Set callback for combo events
  onCombo(callback) {
    this.match3System.onCombo = callback;
  }

  // Set callback for move completion
  onMoveComplete(callback) {
    this.match3System.onMoveComplete = callback;
  }
}
