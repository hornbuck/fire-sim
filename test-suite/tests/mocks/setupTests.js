// setupTests.js
console.log('setupTests.js is running');

import { vi } from 'vitest';

// -------------------
// GLOBAL MOCKS
// -------------------

global.sessionStorage = {
  storage: {},
  setItem(key, value) {
    this.storage[key] = value;
  },
  getItem(key) {
    return this.storage[key] || null;
  },
  clear() {
    this.storage = {};
  },
};

global.window = {
  location: {
    reload: vi.fn(),
  },
};

// -------------------
// DOM MOCK
// -------------------

if (typeof global.document === 'undefined') {
  global.document = {
    createElement: vi.fn(() => ({
      getContext: vi.fn(),
      style: {},
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
    body: {
      appendChild: vi.fn(),
    },
  };
}

// -------------------
// PHASER MOCK
// -------------------

const mockRectangle = {
  setOrigin: vi.fn().mockReturnThis(),
  setInteractive: vi.fn().mockReturnThis(),
  setScrollFactor: vi.fn().mockReturnThis(),
  setDepth: vi.fn().mockReturnThis(),
  on: vi.fn().mockReturnThis(),
};

global.Phaser ??= {};
global.Phaser.Scene ??= class {
  constructor() {
    this.add = {
      image: vi.fn(() => ({
        setInteractive: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
      })),
      rectangle: vi.fn(() => mockRectangle),
      text: vi.fn(() => ({
        setText: vi.fn().mockReturnThis(),
        setVisible: vi.fn().mockReturnThis(),
        setScrollFactor: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
      })),
      existing: vi.fn(),
      sprite: vi.fn(() => ({
        setInteractive: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
        setScrollFactor: vi.fn().mockReturnThis(),
        setOrigin: vi.fn().mockReturnThis(),
        on: vi.fn().mockReturnThis(),
      })),
    };

    this.input = {
      on: vi.fn(),
      keyboard: {
        on: vi.fn(),
        createCursorKeys: vi.fn(() => ({
          left: {},
          right: {},
          up: {},
          down: {},
          space: {},
        })),
      },
    };

    this.sound = {
      play: vi.fn(),
      add: vi.fn(() => ({
        play: vi.fn(),
        stop: vi.fn(),
      })),
    };

    this.time = {
      delayedCall: vi.fn((delay, callback) => {
        callback();
      }),
    };

    this.cameras = {
      main: {
        startFollow: vi.fn(),
        setZoom: vi.fn(),
        setBounds: vi.fn(),
        centerX: 400,
        centerY: 300,
        width: 800,
        height: 600,
      },
    };

    this.physics = {
      add: {
        sprite: vi.fn(() => ({
          setInteractive: vi.fn(),
          on: vi.fn(),
          setData: vi.fn(),
        })),
        overlap: vi.fn(),
      },
    };

    this.events = {
      on: vi.fn(),
      emit: vi.fn(),
    };
  }
};

global.Phaser.Math = {
  Clamp: (val, min, max) => Math.max(min, Math.min(max, val)),
};

global.Phaser.Input = {
  Keyboard: {
    KeyCodes: {},
  },
};

global.Phaser.GameObjects = {
  Text: class {
    setText() {}
    setVisible() {}
  },
  Image: class {
    setTexture() {}
    setVisible() {}
  },
};

// Inject mock directly onto the prototype so all Scene subclasses inherit it
Phaser.Scene.prototype.add ??= {};
Phaser.Scene.prototype.add.rectangle = vi.fn(() => {
  console.log('rectangle() called from prototype - returning mocked rectangle');
  return mockRectangle;
});
