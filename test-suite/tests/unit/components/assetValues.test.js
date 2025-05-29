import { describe, it, expect, beforeEach } from 'vitest'
import * as assetValues from '../../../components/assetValues.js'

describe('assetValues module', () => {
    beforeEach(() => {
        // Reset all values before each test
        assetValues.setHose(0)
        assetValues.setExtinguisher(0)
        assetValues.setHelicopter(0)
        assetValues.setFiretruck(0)
        assetValues.setAirtanker(0)
        assetValues.setHotshotCrew(0)
        assetValues.setSmokejumpers(0)
    })

    it('sets and gets asset values correctly', () => {
        assetValues.setHose(5)
        expect(assetValues.getHose()).toBe(5)

        assetValues.setExtinguisher(3)
        expect(assetValues.getExtinguisher()).toBe(3)

        assetValues.setHelicopter(1)
        expect(assetValues.getHelicopter()).toBe(1)

        assetValues.setFiretruck(2)
        expect(assetValues.getFiretruck()).toBe(2)

        assetValues.setAirtanker(4)
        expect(assetValues.getAirtanker()).toBe(4)

        assetValues.setHotshotCrew(6)
        expect(assetValues.getHotshotCrew()).toBe(6)

        assetValues.setSmokejumpers(7)
        expect(assetValues.getSmokejumpers()).toBe(7)
    })

    it('handles depletion to zero correctly', () => {
        assetValues.setHelicopter(0)
        expect(assetValues.getHelicopter()).toBe(0)

        assetValues.setFiretruck(0)
        expect(assetValues.getFiretruck()).toBe(0)
    })
})
