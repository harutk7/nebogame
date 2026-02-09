/**
 * StateMachine - Manages game states (Menu, Battle, Island, etc.)
 * Allows transitioning between different game screens
 */

export class GameState {
  constructor(name) {
    this.name = name;
  }

  enter(data) {
    // Override: Called when entering this state
  }

  exit() {
    // Override: Called when exiting this state
  }

  update(deltaTime) {
    // Override: Update logic for this state
  }

  render(ctx) {
    // Override: Render logic for this state
  }
}

export class StateMachine {
  constructor() {
    this.states = new Map();
    this.currentState = null;
    this.previousState = null;
  }

  registerState(state) {
    if (!(state instanceof GameState)) {
      throw new Error('StateMachine.registerState() requires a GameState instance');
    }
    this.states.set(state.name, state);
  }

  changeState(stateName, data = null) {
    const newState = this.states.get(stateName);
    if (!newState) {
      throw new Error(`State '${stateName}' not found`);
    }

    if (this.currentState) {
      this.currentState.exit();
    }

    this.previousState = this.currentState;
    this.currentState = newState;
    this.currentState.enter(data);
  }

  getCurrentState() {
    return this.currentState;
  }

  getPreviousState() {
    return this.previousState;
  }

  update(deltaTime) {
    if (this.currentState) {
      this.currentState.update(deltaTime);
    }
  }

  render(ctx) {
    if (this.currentState) {
      this.currentState.render(ctx);
    }
  }
}
