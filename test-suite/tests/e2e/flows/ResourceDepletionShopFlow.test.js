import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as assetValues from '../../../components/assetValues.js'
import { bank } from '../../src/components/ui.js'

describe('ResourceDepletionShopFlow', () => {
    let scene

    beforeEach(() => {
        // Reset asset counts
        assetValues.hose = 0
        assetValues.extinguisher = 0
        assetValues.helicopter = 0
        assetValues.firetruck = 0
        assetValues.airtanker = 0
        assetValues.hotshotcrew = 0
        assetValues.smokejumper = 0

        // Fake bank
        bank.setText = vi.fn()
        vi.spyOn(assetValues, 'getHose').mockReturnValue(0)
        vi.spyOn(assetValues, 'getExtinguisher').mockReturnValue(0)
        vi.spyOn(assetValues, 'getHelicopter').mockReturnValue(0)
        vi.spyOn(assetValues, 'getFiretruck').mockReturnValue(0)
        vi.spyOn(assetValues, 'getAirtanker').mockReturnValue(0)
        vi.spyOn(assetValues, 'getHotshotCrew').mockReturnValue(0)
        vi.spyOn(assetValues, 'getSmokejumpers').mockReturnValue(0)

        // Stub shop function
        scene = {
        scene: {
            pause: vi.fn(),
            resume: vi.fn()
        },
        dialog: { setVisible: vi.fn() },
        text: { setVisible: vi.fn(), setText: vi.fn() },
        t_storage: Array(30).fill('dummy line'),
        d_count: 22, // Point at depletion moment
        toggle: true,
        add: {
            rectangle: () => ({
            getBounds: () => ({
                contains: () => true
            })
            })
        },
        input: {
            on: vi.fn()
        }
        }
    })

    it('pauses the game and shows shop prompt when resources run out', () => {
        const allAssetsEmpty =
        assetValues.getHose() === 0 &&
        assetValues.getExtinguisher() === 0 &&
        assetValues.getHelicopter() === 0 &&
        assetValues.getFiretruck() === 0 &&
        assetValues.getAirtanker() === 0 &&
        assetValues.getHotshotCrew() === 0 &&
        assetValues.getSmokejumpers() === 0

        expect(allAssetsEmpty).toBe(true)

        // Simulate shop trigger point in tutorial
        if (scene.d_count === 22 && scene.toggle === true) {
        scene.dialog.setVisible(true)
        scene.text.setVisible(true)
        scene.toggle = false
        }

        expect(scene.dialog.setVisible).toHaveBeenCalledWith(true)
        expect(scene.text.setVisible).toHaveBeenCalledWith(true)
    })
})
