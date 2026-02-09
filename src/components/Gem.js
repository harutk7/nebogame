/**
 * Gem - Represents a single gem on the match-3 grid
 * Extends Entity for game engine integration
 */
import { Entity } from '../engine/Entity.js';
import { GemColors, GemType } from '../config/game-config.js';

export class Gem extends Entity {
  constructor(gridX, gridY, type) {
    // Calculate pixel position based on grid coordinates
    const pixelPos = Gem.gridToPixel(gridX, gridY);
    super(pixelPos.x, pixelPos.y, 50, 50);
    
    this.gridX = gridX;
    this.gridY = gridY;
    this.type = type;
    this.color = GemColors[type];
    this.isSpecial = false;
    this.specialType = null; // 'line_horizontal', 'line_vertical', 'bomb', 'rainbow'
    this.isMatched = false;
    this.isFalling = false;
    this.targetY = this.y;
    this.animationSpeed = 0.3; // pixels per ms
    
    this.zIndex = 10;
  }

  static gridToPixel(gridX, gridY) {
    const TILE_SIZE = 60;
    const PADDING = 5;
    return {
      x: gridX * TILE_SIZE + PADDING,
      y: gridY * TILE_SIZE + PADDING
    };
  }

  static pixelToGrid(x, y) {
    const TILE_SIZE = 60;
    return {
      x: Math.floor(x / TILE_SIZE),
      y: Math.floor(y / TILE_SIZE)
    };
  }

  setType(type) {
    this.type = type;
    this.color = GemColors[type];
  }

  makeSpecial(specialType) {
    this.isSpecial = true;
    this.specialType = specialType;
  }

  setGridPosition(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
    const pixelPos = Gem.gridToPixel(gridX, gridY);
    this.targetY = pixelPos.y;
  }

  update(deltaTime) {
    // Handle falling animation
    if (this.isFalling) {
      const dy = this.targetY - this.y;
      if (Math.abs(dy) < 1) {
        this.y = this.targetY;
        this.isFalling = false;
      } else {
        this.y += dy * this.animationSpeed * deltaTime * 0.01;
      }
    }
  }

  render(ctx) {
    if (!this.visible) return;

    // Draw gem background (circle or rounded rect)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    
    // Draw rounded rectangle
    const radius = 10;
    const x = this.x;
    const y = this.y;
    const w = this.width;
    const h = this.height;
    
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    // Draw highlight for 3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3, y + h * 0.3, w * 0.15, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw special gem indicator
    if (this.isSpecial) {
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw special symbol
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let symbol = '';
      switch (this.specialType) {
        case 'line_horizontal': symbol = '↔'; break;
        case 'line_vertical': symbol = '↕'; break;
        case 'bomb': symbol = '💣'; break;
        case 'rainbow': symbol = '★'; break;
      }
      ctx.fillText(symbol, x + w / 2, y + h / 2);
    }

    // Draw matched indicator
    if (this.isMatched) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(x, y, w, h);
    }
  }

  // Check if this gem is adjacent to another
  isAdjacentTo(otherGem) {
    const dx = Math.abs(this.gridX - otherGem.gridX);
    const dy = Math.abs(this.gridY - otherGem.gridY);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  clone() {
    const gem = new Gem(this.gridX, this.gridY, this.type);
    gem.isSpecial = this.isSpecial;
    gem.specialType = this.specialType;
    return gem;
  }
}
