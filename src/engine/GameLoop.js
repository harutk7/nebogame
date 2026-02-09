/**
 * GameLoop - Manages the game update and render cycle
 * Uses requestAnimationFrame for smooth 60 FPS gameplay
 */
export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.accumulator = 0;
    this.timeStep = 1000 / 60; // 60 FPS
    this.rafId = null;
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsTime = 0;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(performance.now());
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;
    
    this.rafId = requestAnimationFrame((time) => this.loop(time));
    
    this.deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // Calculate FPS
    this.frameCount++;
    if (currentTime - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = currentTime;
    }
    
    // Fixed time step for updates
    this.accumulator += this.deltaTime;
    while (this.accumulator >= this.timeStep) {
      this.updateCallback(this.timeStep);
      this.accumulator -= this.timeStep;
    }
    
    // Render
    this.renderCallback(this.deltaTime);
  }

  getFPS() {
    return this.fps;
  }
}
