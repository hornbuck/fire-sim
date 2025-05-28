
# Wildfire Command – Comprehensive Test Plan

## Overview
This test suite ensures stability and correctness across the game's core systems, UI interactions, and user flows. Tests are organized by type: Unit, Integration, and End-to-End (E2E).

## Tools
- **Vitest** for unit and integration testing
- **Playwright** or **Cypress** (optional) for E2E testing
- **Firebase Mocking**
- **Phaser Mocking**

---

## Unit Tests
Test pure logic, utility functions, and algorithms.

### Targets
- FireSpread: simulateFireStep, canIgnite
- MapGenerator: generation logic (Perlin, BSP, Cellular)
- Weather: wind, humidity, temperature influence
- DeploymentClickEvents: use_resource logic
- UI: text updates, asset counters

---

## Integration Tests
Test interactions between components and scenes.

### Scenarios
- UIScene ↔ MapScene (fire toggling, tile info, zoom)
- Signup/Login flow using Firebase Auth
- Real-time leaderboard and player score tracking with Firestore
- Event handling between UIScene/MapScene

---

## End-to-End Tests
Simulate real user behavior.

### Scenarios
- Guest player skips login, enters game, starts fire
- New user signs up, completes tutorial, extinguishes fire
- Player runs out of resources, uses shop, resumes play

---

## Coverage Goals
- 100% of MVP features
- All resource deployment paths
- At least one test per user story in design doc
- Firebase/Auth mocked during CI

---

## Running Tests

```bash
npm run test          # Run all tests once
npm run test:watch    # Watch mode
npm run test:coverage # See coverage report
```

---

## Author
Cat Randquist – 2025 Capstone Project
