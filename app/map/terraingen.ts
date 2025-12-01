import { SimplexNoise } from "three/examples/jsm/Addons.js";

export default class TGEN {
  simplex = new SimplexNoise();

  constructor(){}

  simplexFn(x: number, z: number): number {
    return this.simplex.noise(x, z);
  }

  // Fractal simplex with increasing frequency
  simplexOfN(
    x: number,
    z: number,
    octaves: number,
    scale = 0.01,      // global zoom
    lacunarity = 2.0,  // frequency multiplier per octave
    persistence = 0.5  // amplitude multiplier per octave
  ): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxAmplitude = 0;

    for (let i = 0; i < octaves; i++) {
      const nx = x * scale * frequency; // low freq first, then higher
      const nz = z * scale * frequency;

      value += this.simplex.noise(nx, nz) * amplitude;

      maxAmplitude += amplitude;
      amplitude *= persistence;   // each octave contributes less
      frequency *= lacunarity;    // each octave has more detail
    }

    return value / maxAmplitude;  // normalize to roughly [-1, 1]
  }
}
