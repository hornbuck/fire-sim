import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('MapScene and UIScene integration', () => {
    let mapScene
    let uiScene

    beforeEach(() => {
        mapScene = {
        events: {
            emit: vi.fn(),
            on: vi.fn()
        }
        }

        uiScene = {
        updateTileInfo: vi.fn(),
        updateHUD: vi.fn(),
        scene: {
            get: vi.fn(() => mapScene)
        }
        }

        // Fake Phaser event binding
        mapScene.events.on = (event, cb) => {
        if (event === 'tileInfo') cb({ flammability: 0.6, fuel: 12 })
        }
    })

    it('should update tile info when MapScene emits tileInfo', () => {
        mapScene.events.on('tileInfo', uiScene.updateTileInfo)
        expect(uiScene.updateTileInfo).toHaveBeenCalledWith({ flammability: 0.6, fuel: 12 })
    })

    it('should update HUD when MapScene emits updateHUD', () => {
        mapScene.events.on = (event, cb) => {
        if (event === 'updateHUD') cb()
        }

        mapScene.events.on('updateHUD', uiScene.updateHUD)
        expect(uiScene.updateHUD).toHaveBeenCalled()
    })
})
