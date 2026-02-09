/**
 * InputManager - Handles all user input (touch and mouse)
 * Normalizes input events across devices
 */

export const InputType = {
  TOUCH_START: 'touchstart',
  TOUCH_MOVE: 'touchmove',
  TOUCH_END: 'touchend',
  MOUSE_DOWN: 'mousedown',
  MOUSE_MOVE: 'mousemove',
  MOUSE_UP: 'mouseup',
  CLICK: 'click'
};

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.listeners = new Map();
    this.isTouch = 'ontouchstart' in window;
    this.pointers = new Map(); // Active pointers/touches
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    const canvasElement = this.canvas.canvas;
    
    if (this.isTouch) {
      canvasElement.addEventListener('touchstart', (e) => this.handleTouch(e, InputType.TOUCH_START), { passive: false });
      canvasElement.addEventListener('touchmove', (e) => this.handleTouch(e, InputType.TOUCH_MOVE), { passive: false });
      canvasElement.addEventListener('touchend', (e) => this.handleTouch(e, InputType.TOUCH_END), { passive: false });
      canvasElement.addEventListener('touchcancel', (e) => this.handleTouch(e, InputType.TOUCH_END), { passive: false });
    } else {
      canvasElement.addEventListener('mousedown', (e) => this.handleMouse(e, InputType.MOUSE_DOWN));
      canvasElement.addEventListener('mousemove', (e) => this.handleMouse(e, InputType.MOUSE_MOVE));
      canvasElement.addEventListener('mouseup', (e) => this.handleMouse(e, InputType.MOUSE_UP));
      canvasElement.addEventListener('click', (e) => this.handleMouse(e, InputType.CLICK));
    }
  }

  handleTouch(event, type) {
    event.preventDefault();
    
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const pos = this.canvas.screenToCanvas(touch.clientX, touch.clientY);
      
      const inputEvent = {
        type,
        id: touch.identifier,
        x: pos.x,
        y: pos.y,
        originalEvent: event
      };
      
      this.emit(type, inputEvent);
      
      // Track active pointers
      if (type === InputType.TOUCH_START) {
        this.pointers.set(touch.identifier, inputEvent);
      } else if (type === InputType.TOUCH_END) {
        this.pointers.delete(touch.identifier);
      }
    }
  }

  handleMouse(event, type) {
    const pos = this.canvas.screenToCanvas(event.clientX, event.clientY);
    
    const inputEvent = {
      type,
      id: 'mouse',
      x: pos.x,
      y: pos.y,
      button: event.button,
      originalEvent: event
    };
    
    this.emit(type, inputEvent);
    
    if (type === InputType.MOUSE_DOWN) {
      this.pointers.set('mouse', inputEvent);
    } else if (type === InputType.MOUSE_UP) {
      this.pointers.delete('mouse');
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  off(eventType, callback) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(eventType, data) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      for (const callback of listeners) {
        callback(data);
      }
    }
  }

  getActivePointers() {
    return Array.from(this.pointers.values());
  }

  // Swipe detection helper
  detectSwipe(startX, startY, endX, endY, threshold = 30) {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < threshold) return null;
    
    // Determine direction
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  }
}
