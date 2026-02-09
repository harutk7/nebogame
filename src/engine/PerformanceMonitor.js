/**
 * PerformanceMonitor - Tracks FPS and performance metrics
 * Can display debug overlay when needed
 */

export class PerformanceMonitor {
  constructor() {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.frames = [];
    this.maxFrames = 60;
    this.enabled = false;
  }

  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    
    this.frameCount++;
    
    if (delta >= 1000) {
      this.fps = this.frameCount;
      this.frames.push(this.fps);
      
      if (this.frames.length > this.maxFrames) {
        this.frames.shift();
      }
      
      this.frameCount = 0;
      this.lastTime = now;
    }
  }

  getFPS() {
    return this.fps;
  }

  getAverageFPS() {
    if (this.frames.length === 0) return 0;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frames.length);
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  render(ctx) {
    if (!this.enabled) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 120, 60);
    
    ctx.fillStyle = '#00FF00';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`FPS: ${this.fps}`, 20, 30);
    ctx.fillText(`Avg: ${this.getAverageFPS()}`, 20, 50);
    ctx.fillText(`Time: ${Math.round(performance.now())}`, 20, 70);
  }
}
