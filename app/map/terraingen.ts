import { createNoise2D } from "simplex-noise";
import Alea from "alea";

export default class TGEN {
  seed: string; 
  noiseFn: (x:number, y:number) => number;

  constructor(seed?: string){
    this.seed = (seed) ? seed : "";
    this.noiseFn = (this.seed.length > 0) ? createNoise2D(Alea(this.seed)) : createNoise2D();
  }

  blendTerrains(
  biomeMap: (x: number, z: number) => number,
  ...fns: ((x: number, z: number) => number)[]
  ): (x: number, z: number) => number {
  if (fns.length === 1) {
    return fns[0];
  }

  const n = fns.length; // number of layers

  return (x: number, z: number): number => {
    // biomeVal is already [0,1] from your simplexBiomeMap
    let biomeVal = biomeMap(x, z);
    // just in case, clamp it
    biomeVal = Math.max(0, Math.min(1, biomeVal));

    // We want to know which TWO terrains we’re between.
    //
    // Think of biomeVal as moving along the list from 0 (first terrain)
    // to n-1 (last terrain). There are (n-1) transitions.
    const pos = biomeVal * (n - 1);  // 0..(n-1)
    const i0 = Math.floor(pos);      // left terrain index
    const t  = pos - i0;             // local blend factor 0..1

    const idx0 = Math.max(0, Math.min(n - 1, i0));
    const idx1 = Math.max(0, Math.min(n - 1, idx0 + 1));

    // --- 1. Sample both terrain noise functions ---
    const h0Raw = fns[idx0](x, z);  // expected roughly [-1,1] or [0,1]
    const h1Raw = fns[idx1](x, z);

    // Normalize to [0,1] so we can safely use as "micro terrain"
    const h0 = Math.max(0, Math.min(1, (h0Raw + 1) / 2));
    const h1 = Math.max(0, Math.min(1, (h1Raw + 1) / 2));

    // Blend the detail/micro shape
    const detail = h0 * (2 - 2 * t) + h1 * 2*t;  // [0,1]

    // --- 2. Compute which vertical band we’re in ---
    //
    // Each terrain index gets a band of height 1/n in the final [0,1] map.
    // We also blend the "band index" smoothly using t, so transitions
    // between layers are smooth in height as well.
    //
    // Example with 3 layers:
    //   idx0=0..1..2, layerPos in [0..2]
    const layerPos = idx0 + t; // fractional "which layer" we are on

    // Final height: "layer base" + detail inside that layer.
    // layerPos ranges 0..(n-1)
    //
    // Divide by n so the whole thing stays in [0,1]:
    //   layer 0 → ~[0, 1/n]
    //   layer 1 → ~[1/n, 2/n]
    //   ...
    //   layer n-1 → ~[(n-1)/n, 1]
    const height = (layerPos + detail) / n; // 0..1

    return height;
    };
  }



  simplexBiomeMap: (x: number, z: number) => number = (x, z) => (this.noiseFn(x / 600, z / 600) + 1)/2 ;
  mountainous = (x: number, z: number): number => {
    // Base structure for mountains
    const base = this.simplexOfN(
      x, z,
      8,        // more octaves
      0.006,    // higher frequency than hills
      2.0,
      0.5
    ); // ~[-1,1]

    // Ridged noise: high where noise crosses zero
    let ridge = Math.abs(base); // 0..1, ridges at 0-crossings

    // Sharpen peaks
    ridge = Math.pow(ridge, 2); // tweak exponent to taste (1.2–2.0)

    // Add a small high-frequency detail layer on top
    const detail = this.simplexOfN(
      x + 1000, z + 1000,   // offset so it’s uncorrelated
      3,
      0.02,                 // much finer detail
      2.3,
      0.5
    ); // ~[-1,1]

    let d = (detail + 1) / 2; // 0..1
    ridge += d * 0.3;         // add some craggy detail

    // Clamp and remap to [-1,1] for your blendTerrains
    ridge = Math.min(1, Math.max(0, ridge));
    return ridge * 2 - 1; // [-1,1]
  };

  hills = (x: number, z: number): number => {
    const base = this.simplexOfN(
      x, z,
      4,       // a few more octaves
      0.004,   // more detail than plains
      2.0,
      0.5
    ); // ~[-1,1]

    let t = (base + 1) / 2;     // 0..1

    // Slight curve: soft valleys, a bit emphasized tops
    t = Math.pow(t, 1.2);       // 1.0–1.3 is a nice range

    return t * 2 - 1;           // back to [-1,1]
  };

  plains = (x: number, z: number): number => {
    // Broad, low-frequency noise for big gentle shapes
    const base = this.simplexOfN(
      x, z,
      3,       // octaves
      0.002,   // scale: smaller = bigger features
      2.0,     // lacunarity
      0.5      // persistence
    ); // ~[-1,1]
  
    // Squash extremes so plains stay gentle
    let t = (base + 1) / 2;     // 0..1
    t = 0.5 + (t - 0.5) * 0.35; // compress towards 0.5
  
    // Back to roughly [-1,1] (blendTerrains normalizes again anyway)
    return (t * 2 - 1);         // about [-0.35, 0.35]
  };

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

      value += this.noiseFn(nx, nz) * amplitude;

      maxAmplitude += amplitude;
      amplitude *= persistence;   // each octave contributes less
      frequency *= lacunarity;    // each octave has more detail
    }

    return value / maxAmplitude;  // normalize to roughly [-1, 1]
  }
}
