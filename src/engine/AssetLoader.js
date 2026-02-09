/**
 * AssetLoader - Handles loading of images and audio assets
 * Provides progress tracking and error handling
 */

export class AssetLoader {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.onProgress = null;
    this.onComplete = null;
  }

  async loadImage(key, src) {
    this.totalAssets++;
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.images.set(key, img);
        this.loadedAssets++;
        this.reportProgress();
        resolve(img);
      };
      
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }

  async loadImages(imageMap) {
    const promises = [];
    for (const [key, src] of Object.entries(imageMap)) {
      promises.push(this.loadImage(key, src));
    }
    return Promise.all(promises);
  }

  getImage(key) {
    return this.images.get(key);
  }

  hasImage(key) {
    return this.images.has(key);
  }

  reportProgress() {
    if (this.onProgress) {
      const percent = this.totalAssets > 0 
        ? (this.loadedAssets / this.totalAssets) * 100 
        : 100;
      this.onProgress(percent, this.loadedAssets, this.totalAssets);
    }
    
    if (this.loadedAssets === this.totalAssets && this.onComplete) {
      this.onComplete();
    }
  }

  getProgress() {
    return this.totalAssets > 0 
      ? (this.loadedAssets / this.totalAssets) * 100 
      : 100;
  }

  clear() {
    this.images.clear();
    this.audio.clear();
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }
}
