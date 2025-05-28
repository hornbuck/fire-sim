
global.Phaser = {
  Scene: class {},
  Math: {
    Clamp: (val, min, max) => Math.max(min, Math.min(max, val))
  },
  Input: {
    Keyboard: {
      KeyCodes: {}
    }
  }
};
