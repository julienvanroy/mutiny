export default class Controls {
  constructor() {
    this._setActions();
    // this._setKeyboard()
  }

  _setActions() {
    this.actions = {};
    this.actions.up = false;
    this.actions.right = false;
    this.actions.down = false;
    this.actions.left = false;
  }

  get isPressed() {
    return !Object.values(this.actions).every((value) => value === false);
  }

  _setKeyboard() {
    this.keyboard = {};
    this.keyboard.events = {};

    this.keyboard.events.keyDown = (_event) => {
      switch (_event.key) {
        case 'ArrowUp':
        case 'z':
        case 'w':
          this.actions.up = true;
          break;

        case 'ArrowRight':
        case 'd':
          this.actions.right = true;
          break;

        case 'ArrowDown':
        case 's':
          this.actions.down = true;
          break;

        case 'ArrowLeft':
        case 'q':
        case 'a':
          this.actions.left = true;
          break;
      }
    };

    this.keyboard.events.keyUp = (_event) => {
      switch (_event.key) {
        case 'ArrowUp':
        case 'z':
        case 'w':
          this.actions.up = false;
          break;

        case 'ArrowRight':
        case 'd':
          this.actions.right = false;
          break;

        case 'ArrowDown':
        case 's':
          this.actions.down = false;
          break;

        case 'ArrowLeft':
        case 'q':
        case 'a':
          this.actions.left = false;
          break;
      }
    };

    document.addEventListener('keydown', this.keyboard.events.keyDown);
    document.addEventListener('keyup', this.keyboard.events.keyUp);
  }

  destroy() {
    document.removeEventListener('keydown', this.keyboard.events.keyDown);
    document.removeEventListener('keyup', this.keyboard.events.keyUp);
  }
}
