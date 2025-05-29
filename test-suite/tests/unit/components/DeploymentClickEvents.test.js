import '../../mocks/setupTests.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as DeploymentClickEvents from '../../../../src/components/DeploymentClickEvents.js';

describe('DeploymentClickEvents', () => {
  let mockScene;
  let mockTextObj;
  let mockRect;
  let mockSprite;

  beforeEach(() => {
    mockTextObj = {
      width: 100,
      height: 20,
      setOrigin: vi.fn(),
      setAlpha: vi.fn(),
      setInteractive: vi.fn(),
    };

    mockRect = {
      setFillStyle: vi.fn(),
      setOrigin: vi.fn(),
    };

    mockSprite = {
      setInteractive: vi.fn(),
      removeInteractive: vi.fn(),
      on: vi.fn(),
    };

    mockScene = {
      add: {
        sprite: vi.fn(() => mockSprite),
        text: vi.fn(() => mockTextObj),
        rectangle: vi.fn(() => mockRect),
      },
    };
  });

  it('activates a resource and stores it as selected', () => {
    const result = DeploymentClickEvents.activate_resource(mockScene, 'hose');
    expect(mockScene.add.sprite).toHaveBeenCalled();
    expect(mockSprite.setInteractive).toHaveBeenCalled();
  });

  it('deactivates the current resource', () => {
    expect(typeof DeploymentClickEvents.deactivate_current_resource).toBe('function');
    DeploymentClickEvents.deactivate_current_resource(mockSprite);
    expect(mockSprite.removeInteractive).toHaveBeenCalled();
  });

  it('sets tooltip text and displays it', () => {
    DeploymentClickEvents.show_tooltip(mockScene, 100, 200, 'hose-tooltip');
    expect(mockScene.add.text).toHaveBeenCalledWith(
      100,
      200,
      expect.stringContaining('FIRE HOSE'),
      expect.objectContaining({ fontFamily: expect.any(String) })
    );
  });

  it('updates HUD with new text', () => {
    DeploymentClickEvents.set_text('Test', 50, 60, mockScene);
    expect(mockScene.add.text).toHaveBeenCalledWith(
      50,
      60,
      'Test',
      expect.objectContaining({ fontFamily: expect.any(String) })
    );
    expect(mockScene.add.rectangle).toHaveBeenCalledWith(
      50,
      60,
      112, // 100 + 12
      28,  // 20 + 8
      0x333333
    );
  });
});
