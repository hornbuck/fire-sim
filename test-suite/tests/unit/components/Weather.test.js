import { describe, it, expect, beforeEach } from 'vitest'
import Weather from '../../../components/Weather.js'

describe('Weather system', () => {
    let weather

    beforeEach(() => {
        weather = new Weather()
    })

    it('initializes with temperature, wind speed, and direction', () => {
        expect(typeof weather.temperature).toBe('number')
        expect(typeof weather.windSpeed).toBe('number')
        expect(typeof weather.windDirection).toBe('string')
    })

    it('calculates a numeric spread modifier', () => {
        const modifier = weather.getSpreadModifier()
        expect(typeof modifier).toBe('number')
        expect(modifier).toBeGreaterThan(0)
    })

    it('updates weather values over time', () => {
        const oldTemp = weather.temperature
        const oldWind = weather.windSpeed
        const oldDir = weather.windDirection

        weather.updateOverTime()

        // Allow small variation — not guaranteed to change every call
        const changed = (
        weather.temperature !== oldTemp ||
        weather.windSpeed !== oldWind ||
        weather.windDirection !== oldDir
        )

        expect(changed).toBe(true)
    })
})
