import '../../mocks/setupTests.js';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as Deployment from '../../../../src/components/DeploymentClickEvents.js';

// Create a mock sprite with all methods used by your code
const mockSprite = {
    setInteractive: vi.fn(),
    on: vi.fn(),
    setDepth: vi.fn(),
    setVisible: vi.fn(),
    setTexture: vi.fn(),
};

// Create a mock scene with add.text returning an object with setText, setVisible, setDepth, and setOrigin
const mockScene = {
    add: {
        text: vi.fn(() => ({
        setText: vi.fn(),
        setVisible: vi.fn(),
        setDepth: vi.fn(),
        setOrigin: vi.fn(() => mockScene.add.text()), // Return self for chaining
        })),
    },
};

describe('DeploymentClickEvents', () => {
    beforeEach(() => {
        vi.restoreAllMocks();

        // Setup resourceSprites with mock sprites
        Deployment.resourceSprites = {
        hose: mockSprite,
        extinguisher: mockSprite,
        helicopter: mockSprite,
        firetruck: mockSprite,
        airtanker: mockSprite,
        hotshotcrew: mockSprite,
        smokejumper: mockSprite,
        };

        Deployment.currentSelection = null;
    });

    it('activates a resource and stores it as selected', () => {
        Deployment.activate_resource('hose');
        expect(Deployment.currentSelection).toBe('hose');
        expect(Deployment.resourceSprites.hose.setInteractive).toHaveBeenCalled();
    });

    it('deactivates the current resource', () => {
        Deployment.activate_resource('extinguisher');
        expect(Deployment.currentSelection).toBe('extinguisher');

        Deployment.deactivate();
        expect(Deployment.currentSelection).toBe(null);
    });

    it('sets tooltip text and displays it', () => {
        const mockTextObj = {
        setText: vi.fn(),
        };
        const description = 'Deploys water in a line.';
        Deployment.show_tooltip(mockTextObj, description);
        expect(mockTextObj.setText).toHaveBeenCalledWith(description);
    });

    it('updates HUD with new text', () => {
        Deployment.set_text('Out of helicopters!', 0, 0, mockScene);
        expect(mockScene.add.text).toHaveBeenCalledWith(
        0,
        0,
        'Out of helicopters!',
        expect.any(Object)
        );
    });
});
