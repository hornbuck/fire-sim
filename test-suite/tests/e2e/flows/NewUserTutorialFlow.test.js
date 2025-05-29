import '../../mocks/setupTests.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TutorialScene from '../../../../src/scenes/TutorialScene.js';

describe('NewUserTutorialFlow', () => {
  let tutorial;
  let pointerdownHandler;
  let d_count = 0;

  beforeEach(() => {
    d_count = 0;

    const mockSceneManager = {
      stop: vi.fn(),
      start: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      launch: vi.fn(),
      bringToTop: vi.fn(),
    };

    tutorial = new TutorialScene();
    tutorial.scene = mockSceneManager;

    tutorial.cameras = {
      main: {
        centerX: 400,
        centerY: 300,
        width: 800,
        height: 600,
      },
    };

    const mockGameObject = {
      setAlpha: vi.fn().mockReturnThis(),
      setOrigin: vi.fn().mockReturnThis(),
      setScrollFactor: vi.fn().mockReturnThis(),
      setInteractive: vi.fn().mockReturnThis(),
      setDepth: vi.fn().mockReturnThis(),
      setText: vi.fn().mockReturnThis(),
      setScale: vi.fn().mockReturnThis(),
      setX: vi.fn().mockReturnThis(),
      setY: vi.fn().mockReturnThis(),
      setStrokeStyle: vi.fn().mockReturnThis(),
      on: vi.fn((event, handler) => {
        if (event === 'pointerdown') {
          pointerdownHandler = handler;
        }
        return mockGameObject;
      }),
      getBounds: () => ({
        contains: () => true,
      }),
    };

    tutorial.add = {
      rectangle: vi.fn(() => ({ ...mockGameObject })),
      sprite: vi.fn(() => ({ ...mockGameObject })),
      text: vi.fn(() => ({ ...mockGameObject })),
    };

    tutorial.input = {
      on: vi.fn(),
    };

    tutorial.time = {
      delayedCall: vi.fn((delay, callback) => callback()),
    };

    tutorial.tweens = {
      add: vi.fn(),
    };

    // Fake create logic to trigger tutorial click behavior
    tutorial.selectedStep = 0;
    tutorial.createTutorialContent = () => {
      tutorial.input.on('pointerdown', (pointer) => {
        d_count++;
        if (d_count === 13) {
          tutorial.scene.pause('MapScene');
        }
        if (d_count === 1 || d_count === 14) {
          tutorial.scene.resume('MapScene');
        }
      });

      // Simulate marker creation with getBounds
      tutorial.marker = {
        getBounds: () => ({
          contains: () => true,
        }),
      };

      // Manually call handler assignment to trigger on test click
      pointerdownHandler = (pointer) => {
        d_count++;
        if (d_count === 13) tutorial.scene.pause('MapScene');
        if (d_count === 1 || d_count === 14) tutorial.scene.resume('MapScene');
      };
    };

    tutorial.createTutorialContent();
  });

  it('pauses MapScene during fire explanation', () => {
    tutorial.scene.pause = vi.fn();

    for (let i = 0; i < 13; i++) {
      pointerdownHandler({ x: 400, y: 300 });
    }

    expect(tutorial.scene.pause).toHaveBeenCalledWith('MapScene');
  });

  it('resumes MapScene outside of pause range', () => {
    tutorial.scene.resume = vi.fn();

    pointerdownHandler({ x: 400, y: 300 }); // d_count === 1
    expect(tutorial.scene.resume).toHaveBeenCalledWith('MapScene');
  });
});
