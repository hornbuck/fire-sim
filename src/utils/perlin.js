/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

// Original Perlin Noise module adapted for ES module syntax

// Internal variables
const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

let perlin; // Perlin noise array
let perlin_octaves = 4; // Default to medium smoothness
let perlin_amp_falloff = 0.5; // Default amplitude falloff

// Set up the random seed
function seed(seedVal) {
  const lcg = (() => {
    const m = 4294967296;
    const a = 1664525;
    const c = 1013904223;
    let seed, z;

    return {
      setSeed: val => {
        z = seed = (val === undefined ? Math.random() * m : val) >>> 0;
      },
      getSeed: () => seed,
      rand: () => (z = (z * a + c) % m) / m
    };
  })();

  lcg.setSeed(seedVal);
  perlin = new Array(PERLIN_SIZE + 1);
  for (let i = 0; i < PERLIN_SIZE + 1; i++) {
    perlin[i] = lcg.rand();
  }
}

// 2D Perlin noise
function perlin2(x, y) {
  if (perlin === undefined) {
    seed(Math.random());
  }

  const xi = Math.floor(x);
  const yi = Math.floor(y);

  const xf = x - xi;
  const yf = y - yi;

  const rxf = fade(xf);
  const ryf = fade(yf);

  const r1 = lerp(
      perlin[(xi & PERLIN_SIZE) + (yi & PERLIN_SIZE) * PERLIN_YWRAP],
      perlin[(xi + 1 & PERLIN_SIZE) + (yi & PERLIN_SIZE) * PERLIN_YWRAP],
      rxf
  );
  const r2 = lerp(
      perlin[(xi & PERLIN_SIZE) + (yi + 1 & PERLIN_SIZE) * PERLIN_YWRAP],
      perlin[(xi + 1 & PERLIN_SIZE) + (yi + 1 & PERLIN_SIZE) * PERLIN_YWRAP],
      rxf
  );

  return lerp(r1, r2, ryf);
}

// 3D Perlin noise
function perlin3(x, y, z) {
  if (perlin === undefined) {
    seed(Math.random());
  }

  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);

  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;

  const rxf = fade(xf);
  const ryf = fade(yf);
  const rzf = fade(zf);

  const r1 = lerp(
      perlin[(xi & PERLIN_SIZE) +
      (yi & PERLIN_SIZE) * PERLIN_YWRAP +
      (zi & PERLIN_SIZE) * PERLIN_ZWRAP],
      perlin[(xi + 1 & PERLIN_SIZE) +
      (yi & PERLIN_SIZE) * PERLIN_YWRAP +
      (zi & PERLIN_SIZE) * PERLIN_ZWRAP],
      rxf
  );

  const r2 = lerp(
      perlin[(xi & PERLIN_SIZE) +
      (yi + 1 & PERLIN_SIZE) * PERLIN_YWRAP +
      (zi & PERLIN_SIZE) * PERLIN_ZWRAP],
      perlin[(xi + 1 & PERLIN_SIZE) +
      (yi + 1 & PERLIN_SIZE) * PERLIN_YWRAP +
      (zi & PERLIN_SIZE) * PERLIN_ZWRAP],
      rxf
  );

  return lerp(r1, r2, ryf);
}

// Helper functions
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

// Export the noise functions
export const noise = {
  seed,
  perlin2,
  perlin3
};
