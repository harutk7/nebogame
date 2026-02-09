/**
 * Nebogame - Main Entry Point
 * Match-3 Puzzle RPG
 */

import { 
  Canvas, 
  GameLoop, 
  Renderer, 
  EntityManager, 
  StateMachine,
  InputManager,
  AssetLoader,
  PerformanceMonitor,
  RenderLayer
} from './engine/index.js';

import { GridSystem } from './systems/GridSystem.js';

class Game {
  constructor() {
    this.canvas = null;
    this.gameLoop = null;
    this.renderer = null;
    this.entityManager = null;
    this.stateMachine = null;
    this.inputManager = null;
    this.assetLoader = null;
    this.performanceMonitor = null;
    this.gridSystem = null;
    
    this.init();
  }

  async init() {
    try {
      console.log('Initializing Nebogame...');
      
      // Initialize canvas
      this.canvas = new Canvas('game-canvas');
      
      // Initialize renderer
      this.renderer = new Renderer(this.canvas);
      
      // Initialize entity manager
      this.entityManager = new EntityManager();
      
      // Initialize state machine
      this.stateMachine = new StateMachine();
      
      // Initialize input
      this.inputManager = new InputManager(this.canvas);
      
      // Initialize asset loader
      this.assetLoader = new AssetLoader();
      
      // Initialize performance monitor
      this.performanceMonitor = new PerformanceMonitor();
      this.performanceMonitor.enable();
      
      // Initialize match-3 grid system
      this.gridSystem = new GridSystem(this.entityManager, this.inputManager);
      this.gridSystem.init();
      
      // Setup match-3 callbacks
      this.gridSystem.onMatch((matches, score, combo) => {
        console.log(`Match! Score: ${score}, Combo: ${combo}`);
      });
      
      this.gridSystem.onCombo((combo) => {
        console.log(`Combo x${combo}!`);
      });
      
      // Create game loop
      this.gameLoop = new GameLoop(
        (deltaTime) => this.update(deltaTime),
        (deltaTime) => this.render(deltaTime)
      );
      
      // Setup input handlers
      this.setupInput();
      
      // Start game loop
      this.gameLoop.start();
      
      console.log('Nebogame initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }

  setupInput() {
    this.inputManager.on('touchstart', (e) => {
      console.log('Touch start:', e.x, e.y);
    });
    
    this.inputManager.on('mousedown', (e) => {
      console.log('Mouse down:', e.x, e.y);
    });
  }

  update(deltaTime) {
    this.performanceMonitor.update();
    this.entityManager.update(deltaTime);
    this.stateMachine.update(deltaTime);
    if (this.gridSystem) {
      this.gridSystem.update(deltaTime);
    }
  }

  render(deltaTime) {
    // Clear and render via renderer
    this.renderer.render(deltaTime);
    
    // Render match-3 grid
    if (this.gridSystem) {
      this.gridSystem.render(this.canvas.getContext());
    }
    
    // Render entities
    this.entityManager.render(this.canvas.getContext());
    
    // Render performance monitor
    this.performanceMonitor.render(this.canvas.getContext());
  }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
