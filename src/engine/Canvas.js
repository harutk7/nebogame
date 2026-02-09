/**
 * Canvas - Manages the HTML5 Canvas element and 2D context
 * Handles resizing and high-DPI displays
 */
import { GAME_CONFIG } from '../config/game-config.js';

export class Canvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    
    // Logical dimensions (CSS pixels)
    this.logicalWidth = GAME_CONFIG.CANVAS.WIDTH;
    this.logicalHeight = GAME_CONFIG.CANVAS.HEIGHT;
    
    this.setupCanvas();
    this.handleResize();
    
    window.addEventListener('resize', () => this.handleResize());
  }

  setupCanvas() {
    // Set actual canvas size (physical pixels)
    this.canvas.width = this.logicalWidth * this.dpr;
    this.canvas.height = this.logicalHeight * this.dpr;
    
    // Set CSS size (logical pixels)
    this.canvas.style.width = `${this.logicalWidth}px`;
    this.canvas.style.height = `${this.logicalHeight}px`;
    
    // Scale context for high-DPI
    this.ctx.scale(this.dpr, this.dpr);
    
    // Enable image smoothing
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  handleResize() {
    // Calculate scale to fit screen while maintaining aspect ratio
    const container = this.canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    const scaleX = containerWidth / this.logicalWidth;
    const scaleY = containerHeight / this.logicalHeight;
    const scale = Math.min(scaleX, scaleY);
    
    this.canvas.style.width = `${this.logicalWidth * scale}px`;
    this.canvas.style.height = `${this.logicalHeight * scale}px`;
  }

  clear(color = GAME_CONFIG.CANVAS.BACKGROUND_COLOR) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
  }

  getContext() {
    return this.ctx;
  }

  getWidth() {
    return this.logicalWidth;
  }

  getHeight() {
    return this.logicalHeight;
  }

  // Convert screen coordinates to canvas coordinates
  screenToCanvas(screenX, screenY) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.logicalWidth / rect.width;
    const scaleY = this.logicalHeight / rect.height;
    
    return {
      x: (screenX - rect.left) * scaleX,
      y: (screenY - rect.top) * scaleY
    };
  }
}
