import { describe, it, expect, vi } from 'vitest'
import { set_text, show_tooltip } from '../../../components/ui.js'

describe('ui.js utilities', () => {
    it('updates a text object with new content', () => {
        const mockTextObj = {
        setText: vi.fn()
        }

        set_text(mockTextObj, 'New Coins: 500')
        expect(mockTextObj.setText).toHaveBeenCalledWith('New Coins: 500')
    })

    it('shows a tooltip with description text', () => {
        const mockTooltip = {
        setText: vi.fn(),
        setVisible: vi.fn()
        }

        const description = 'Deploy a helicopter to suppress large fires.'
        show_tooltip(mockTooltip, description)

        expect(mockTooltip.setText).toHaveBeenCalledWith(description)
        expect(mockTooltip.setVisible).toHaveBeenCalledWith(true)
    })
})
