/**
 * Entity - Base class for all game objects
 * Provides position, size, visibility, and lifecycle management
 */
export class Entity {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.id = Entity.generateId();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.visible = true;
    this.active = true;
    this.zIndex = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.opacity = 1;
  }

  static idCounter = 0;
  static generateId() {
    return `entity_${++Entity.idCounter}`;
  }

  update(deltaTime) {
    // Override in subclasses
  }

  render(ctx) {
    if (!this.visible) return;
    // Override in subclasses
  }

  // Get bounding box for hit testing
  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  // Check if point is inside entity
  containsPoint(x, y) {
    const bounds = this.getBounds();
    return x >= bounds.x && 
           x <= bounds.x + bounds.width && 
           y >= bounds.y && 
           y <= bounds.y + bounds.height;
  }

  // Get center point
  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    };
  }

  destroy() {
    this.active = false;
    this.visible = false;
  }
}
