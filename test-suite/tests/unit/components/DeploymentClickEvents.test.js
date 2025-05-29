import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as Deployment from '../../src/components/DeploymentClickEvents.js'

// Mock shared state
let selected = null
let tooltipText = ''
let mockUI = {
    update: vi.fn(),
    showTooltip: vi.fn()
    }

    describe('DeploymentClickEvents', () => {
    beforeEach(() => {
        selected = null
        tooltipText = ''
        vi.restoreAllMocks()
    })

    it('activates a resource and stores it as selected', () => {
        Deployment.activate_resource('hose')
        expect(Deployment.currentSelection).toBe('hose')
    })

    it('deactivates the current resource', () => {
        Deployment.activate_resource('extinguisher')
        expect(Deployment.currentSelection).toBe('extinguisher')

        Deployment.deactivate()
        expect(Deployment.currentSelection).toBe(null)
    })

    it('sets tooltip text and displays it', () => {
        const mockTextObj = {
        setText: vi.fn()
        }
        const description = 'Deploys water in a line.'
        Deployment.show_tooltip(mockTextObj, description)

        expect(mockTextObj.setText).toHaveBeenCalledWith(description)
    })

    it('updates HUD with new text', () => {
        const textObj = {
        setText: vi.fn()
        }

        Deployment.set_text(textObj, 'Out of helicopters!')
        expect(textObj.setText).toHaveBeenCalledWith('Out of helicopters!')
    })
})
