import '../../mocks/setupTests.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as DeploymentClickEvents from '../../../../src/components/DeploymentClickEvents.js';

describe('DeploymentClickEvents', () => {
    let mockScene;

    beforeEach(() => {
        mockScene = {
        add: {
            text: vi.fn(() => ({ setOrigin: vi.fn(), setAlpha: vi.fn(), setInteractive: vi.fn() })),
            rectangle: vi.fn(() => ({ setFillStyle: vi.fn(), setOrigin: vi.fn() })),
        },
        };
    });

    it('activates a resource and stores it as selected', () => {
        const fakeResource = {
        setInteractive: vi.fn(),
        on: vi.fn(),
        };
        DeploymentClickEvents.activate_resource(mockScene, 'waterHose', fakeResource);
        expect(fakeResource.setInteractive).toHaveBeenCalled();
    });

    it('deactivates the current resource', () => {
        const fakeResource = {
        setInteractive: vi.fn(),
        on: vi.fn(),
        removeInteractive: vi.fn(),
        };
        DeploymentClickEvents.activate_resource(mockScene, 'waterHose', fakeResource);
        DeploymentClickEvents.deactivate_current_resource(fakeResource);
        expect(fakeResource.removeInteractive).toHaveBeenCalled();
    });

    it('sets tooltip text and displays it', () => {
        DeploymentClickEvents.show_tooltip(mockScene, 100, 200, 'Tooltip text');
        expect(mockScene.add.text).toHaveBeenCalled();
    });

    it('updates HUD with new text', () => {
        DeploymentClickEvents.set_text(mockScene, 100, 200, 'Status: OK');
        expect(mockScene.add.rectangle).toHaveBeenCalled();
        expect(mockScene.add.text).toHaveBeenCalled();
    });
});
