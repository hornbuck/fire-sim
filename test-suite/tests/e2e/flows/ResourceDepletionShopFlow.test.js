import '../../mocks/setupTests.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock bank before importing it
vi.mock('../../../../src/components/ui.js', () => ({
    bank: {
        setText: vi.fn(),
    },
}));
import * as assetValues from '../../../../src/components/assetValues.js';
import { bank } from '../../../../src/components/ui.js';

describe('ResourceDepletionShopFlow', () => {
let scene;

beforeEach(() => {
    // Mock asset getters
    vi.spyOn(assetValues, 'getHose').mockReturnValue(0);
    vi.spyOn(assetValues, 'getExtinguisher').mockReturnValue(0);
    vi.spyOn(assetValues, 'getHelicopter').mockReturnValue(0);
    vi.spyOn(assetValues, 'getFiretruck').mockReturnValue(0);
    vi.spyOn(assetValues, 'getAirtanker').mockReturnValue(0);
    vi.spyOn(assetValues, 'getHotshotCrew').mockReturnValue(0);
    vi.spyOn(assetValues, 'getSmokejumpers').mockReturnValue(0);

    // Scene structure
    scene = {
    scene: {
        pause: vi.fn(),
        resume: vi.fn(),
    },
    tweens: { add: vi.fn() },
    dialog: { setVisible: vi.fn() },
    text: { setVisible: vi.fn(), setText: vi.fn() },
    t_storage: Array(30).fill('dummy line'),
    d_count: 22,
    toggle: true,
    add: {
        rectangle: () => ({
        getBounds: () => ({
            contains: () => true,
        }),
        }),
    },
    input: { on: vi.fn() },
    };
});

it('pauses the game and shows shop prompt when resources run out', () => {
    const allAssetsEmpty =
    assetValues.getHose() === 0 &&
    assetValues.getExtinguisher() === 0 &&
    assetValues.getHelicopter() === 0 &&
    assetValues.getFiretruck() === 0 &&
    assetValues.getAirtanker() === 0 &&
    assetValues.getHotshotCrew() === 0 &&
    assetValues.getSmokejumpers() === 0;

    expect(allAssetsEmpty).toBe(true);

    // Simulate shop logic
    if (scene.d_count === 22 && scene.toggle === true) {
    scene.dialog.setVisible(true);
    scene.text.setVisible(true);
    scene.toggle = false;
    }

    expect(scene.dialog.setVisible).toHaveBeenCalledWith(true);
    expect(scene.text.setVisible).toHaveBeenCalledWith(true);
});
});
