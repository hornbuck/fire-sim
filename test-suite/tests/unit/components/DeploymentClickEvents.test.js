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
      width: 120,
      height: 40,
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
        text: vi.fn(() => mockTextObj),
        rectangle: vi.fn(() => mockRect),
        sprite: vi.fn(() => mockSprite),
      },
    };
  });

  it('activates a resource and stores it as selected', () => {
    DeploymentClickEvents.activate_resource(mockScene, 'waterHose');
    expect(mockScene.add.sprite).toHaveBeenCalled();
    expect(mockSprite.setInteractive).toHaveBeenCalled();
  });

  it('deactivates the current resource', () => {
    DeploymentClickEvents.activate_resource(mockScene, 'waterHose');
    DeploymentClickEvents.deactivate_current_resource(mockSprite);
    expect(mockSprite.removeInteractive).toHaveBeenCalled();
  });

  it('sets tooltip text and displays it', () => {
    DeploymentClickEvents.show_tooltip(mockScene, 100, 200, 'hose-tooltip');
    expect(mockScene.add.text).toHaveBeenCalled();
  });

  it('updates HUD with new text', () => {
    DeploymentClickEvents.set_text('Test Message', 100, 100, mockScene);
    expect(mockScene.add.rectangle).toHaveBeenCalled();
    expect(mockScene.add.text).toHaveBeenCalled();
  });
});
