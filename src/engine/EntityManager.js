/**
 * EntityManager - Manages all game entities
 * Handles entity creation, updates, rendering, and cleanup
 */
import { Entity } from './Entity.js';

export class EntityManager {
  constructor() {
    this.entities = new Map();
    this.entitiesToAdd = [];
    this.entitiesToRemove = [];
    this.isUpdating = false;
  }

  add(entity) {
    if (!(entity instanceof Entity)) {
      throw new Error('EntityManager.add() requires an Entity instance');
    }
    
    if (this.isUpdating) {
      this.entitiesToAdd.push(entity);
    } else {
      this.entities.set(entity.id, entity);
    }
    return entity;
  }

  remove(entity) {
    if (this.isUpdating) {
      this.entitiesToRemove.push(entity);
    } else {
      this.entities.delete(entity.id);
    }
  }

  removeById(id) {
    const entity = this.entities.get(id);
    if (entity) {
      this.remove(entity);
    }
  }

  get(id) {
    return this.entities.get(id);
  }

  getAll() {
    return Array.from(this.entities.values());
  }

  getActive() {
    return this.getAll().filter(e => e.active);
  }

  getVisible() {
    return this.getAll().filter(e => e.visible);
  }

  // Find entities at a specific point (for touch/mouse)
  getEntitiesAt(x, y) {
    return this.getActive()
      .filter(e => e.containsPoint(x, y))
      .sort((a, b) => b.zIndex - a.zIndex);
  }

  update(deltaTime) {
    this.isUpdating = true;
    
    for (const entity of this.entities.values()) {
      if (entity.active) {
        entity.update(deltaTime);
      }
    }
    
    this.isUpdating = false;
    this.processPendingChanges();
  }

  render(ctx) {
    const visible = this.getVisible()
      .sort((a, b) => a.zIndex - b.zIndex);
    
    for (const entity of visible) {
      ctx.save();
      entity.render(ctx);
      ctx.restore();
    }
  }

  processPendingChanges() {
    // Add pending entities
    for (const entity of this.entitiesToAdd) {
      this.entities.set(entity.id, entity);
    }
    this.entitiesToAdd = [];
    
    // Remove pending entities
    for (const entity of this.entitiesToRemove) {
      this.entities.delete(entity.id);
    }
    this.entitiesToRemove = [];
  }

  clear() {
    this.entities.clear();
    this.entitiesToAdd = [];
    this.entitiesToRemove = [];
  }

  count() {
    return this.entities.size;
  }
}
