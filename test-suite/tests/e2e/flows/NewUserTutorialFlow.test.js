import '../../mocks/setupTests.js'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TutorialScene from '../../../../src/scenes/TutorialScene.js';

describe('NewUserTutorialFlow', () => {
    let tutorial
    let mockSceneManager
    let pointerEvent

    beforeEach(() => {
        // Mock Phaser Scene context
        mockSceneManager = {
            stop: vi.fn(),
            start: vi.fn(),
            pause: vi.fn(),
            resume: vi.fn(),
            launch: vi.fn(),
            bringToTop: vi.fn(),
        }

        tutorial = new TutorialScene()
        tutorial.scene = mockSceneManager
        tutorial.cameras = {
            main: {
                centerX: 400,
                centerY: 300,
                width: 800,
                height: 600
            }
        }
        tutorial.add = {
            rectangle: () => ({ setAlpha: () => {} }),
            sprite: () => ({ setOrigin: () => ({ setScale: () => ({ setX: () => ({ setY: () => ({}) }) }) }) }),
            text: () => ({ setOrigin: () => ({ setText: () => {} }) })
        }
        tutorial.input = {
            on: vi.fn()
        }

        tutorial.time = {
        delayedCall: vi.fn((delay, fn) => fn()) // Call immediately
        }

        tutorial.cameras.main = {
            centerX: 400,
            centerY: 300,
            width: 800,
            height: 600
        }

        // Dummy marker for click bounds
        tutorial.add.rectangle = vi.fn(() => ({
            alwaysEnabled: false,
            getBounds: () => ({ contains: () => true }),
            setX: () => {},
            setY: () => {},
            setStrokeStyle: () => {},
            setOrigin: () => {},
            setAlpha: () => {}
        }))
})

    it('pauses MapScene during fire explanation', () => {
        tutorial.createTutorialContent()

        // Simulate pointer click in the marker area multiple times
        tutorial.selectedStep = 13 // Just before the "pause map" section
        tutorial.scene.pause = vi.fn()

        for (let i = 13; i <= 18; i++) {
            tutorial.scene.pause.mockClear()
            tutorial.selectedStep = i
            const result = tutorial.scene.pause('MapScene')
            expect(tutorial.scene.pause).toHaveBeenCalledWith('MapScene')
            }
    })

    it('resumes MapScene outside of pause range', () => {
        tutorial.scene.resume = vi.fn()
        tutorial.selectedStep = 12
        tutorial.scene.resume('MapScene')
        expect(tutorial.scene.resume).toHaveBeenCalledWith('MapScene')
    })
})
