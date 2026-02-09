/**
 * Renderer - Handles all drawing operations
 * Supports multiple render layers for organized drawing
 */

export class RenderLayer {
  static BACKGROUND = 0;
  static GAME = 1;
  static UI = 2;
  static OVERLAY = 3;
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext();
    this.renderCallbacks = new Map();
    
    // Initialize render layers
    for (const layer of Object.values(RenderLayer)) {
      this.renderCallbacks.set(layer, []);
    }
  }

  // Register a callback to be called for a specific layer
  addToLayer(layer, callback, priority = 0) {
    if (!this.renderCallbacks.has(layer)) {
      throw new Error(`Invalid render layer: ${layer}`);
    }
    
    const callbacks = this.renderCallbacks.get(layer);
    callbacks.push({ callback, priority });
    callbacks.sort((a, b) => a.priority - b.priority);
  }

  removeFromLayer(layer, callback) {
    const callbacks = this.renderCallbacks.get(layer);
    const index = callbacks.findIndex(c => c.callback === callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  clearLayer(layer) {
    if (this.renderCallbacks.has(layer)) {
      this.renderCallbacks.set(layer, []);
    }
  }

  render(deltaTime) {
    const ctx = this.ctx;
    
    // Clear canvas
    this.canvas.clear();
    
    // Render each layer in order
    for (const layer of Object.values(RenderLayer).sort((a, b) => a - b)) {
      const callbacks = this.renderCallbacks.get(layer);
      for (const { callback } of callbacks) {
        ctx.save();
        callback(ctx, deltaTime);
        ctx.restore();
      }
    }
  }

  // Utility drawing methods
  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  drawCircle(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawText(text, x, y, options = {}) {
    const {
      font = '16px sans-serif',
      color = '#FFFFFF',
      align = 'left',
      baseline = 'top'
    } = options;
    
    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
  }

  drawImage(image, x, y, width, height) {
    if (image && image.complete) {
      this.ctx.drawImage(image, x, y, width, height);
    }
  }
}
