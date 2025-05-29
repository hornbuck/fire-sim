import '../../mocks/setupTests.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as DeploymentClickEvents from '../../../src/components/DeploymentClickEvents';

describe('DeploymentClickEvents', () => {
  let mockScene;
  let mockSprite;

  beforeEach(() => {
    mockSprite = {
      name: 'hose',
      setTexture: vi.fn(),
      setInteractive: vi.fn(),
      on: vi.fn(),
      removeInteractive: vi.fn()
    };

    mockScene = {
      add: {
        text: vi.fn(() => ({
          width: 100,
          height: 20,
          depth: 5,
          setOrigin: vi.fn().mockReturnThis()
        })),
        rectangle: vi.fn(() => ({
          setOrigin: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis()
        }))
      },
      input: {
        setDefaultCursor: vi.fn()
      },
      events: {
        emit: vi.fn()
      },
      time: {
        delayedCall: vi.fn()
      },
      game: {
        scale: {
          width: 800,
          height: 600
        }
      },
      scene: {
        get: vi.fn(() => mockScene)
      },
      fallbackNotificationText: null,
      previewOverlay: {
        clear: vi.fn()
      },
      scale: {
        width: 800,
        height: 600
      }
    };
  });

  it('activates a resource and stores it as selected', () => {
    DeploymentClickEvents.activate_resource(
      0,
      mockSprite,
      'hose',
      'on-cursor.png',
      'off-cursor.png',
      'WATER-ON',
      'WATER-OFF',
      mockScene
    );

    expect(mockSprite.setInteractive).toHaveBeenCalled();
    expect(mockSprite.on).toHaveBeenCalledWith('pointerdown', expect.any(Function), expect.anything());
  });

  it('deactivates the current resource', () => {
    DeploymentClickEvents.deactivate_current_resource(mockSprite);
    // It should call removeInteractive on the mock sprite
    expect(mockSprite.removeInteractive).toHaveBeenCalled();
  });

  it('sets tooltip text and displays it', () => {
    DeploymentClickEvents.show_tooltip(mockSprite, 'hose-tooltip', 100, 100, mockScene);
    expect(mockSprite.on).toHaveBeenCalledWith('pointerover', expect.any(Function));
    expect(mockSprite.on).toHaveBeenCalledWith('pointerout', expect.any(Function));
  });

  it('updates HUD with new text', () => {
    const textObj = DeploymentClickEvents.set_text('Test Text', 100, 200, mockScene);
    expect(mockScene.add.text).toHaveBeenCalled();
    expect(mockScene.add.rectangle).toHaveBeenCalled();
    expect(textObj.setOrigin).toHaveBeenCalled();
  });
});
