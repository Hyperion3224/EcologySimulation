import Scene from "./scene";
import { Board } from "./map/board";
import { SimplexNoise } from "three/examples/jsm/Addons.js";

export default function Home() {
  const simplex = new SimplexNoise(); 
  
  const board = new Board({x: 250, y:250}, (x,y)=>{
    //    https://cgvr.informatik.uni-bremen.de/teaching/cg_literatur/simplexnoise.pdf      pg.11
    return getHeightForWorld(x,y);
  })
  
  // Fractal noise (FBM)
  function fbm2D(
    x: number,
    y: number,
    octaves: number,
    lacunarity: number,
    gain: number
  ): number {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
  
    for (let i = 0; i < octaves; i++) {
      value += amplitude * simplex.noise(x * frequency, y * frequency);
      frequency *= lacunarity;
      amplitude *= gain;
    }
  
    // fbm is roughly in [-sum(amplitudes), sum(amplitudes)], normalize approx to [-1, 1]
    return value;
  }
  
   function getHeightForWorld(x: number, y: number): number {
    // 1) Continents: very low frequency
    const continentScale = 0.0002;         // smaller = bigger continents
    const continent = fbm2D(
      x * continentScale,
      y * continentScale,
      4,   // octaves
      2.0, // lacunarity
      0.5  // gain
    );
  
    // 2) Details: higher frequency
    const detailScale = 0.02;
    const detail = fbm2D(
      x * detailScale,
      y * detailScale,
      4,
      2.0,
      0.5
    );
  
    // Normalize both roughly to [-1, 1] → then to [0, 1]
    const continentN = (continent + 1) * 0.5;
    const detailN    = (detail + 1) * 0.5;
  
    // 3) Combine: continents dominate, details just add spice
    let height = continentN * 0.7 + detailN * 0.3;
  
    // 4) Sea level threshold: push most values under water
    const seaLevel = 0.5; // raise this for more ocean, lower for more land
    height = height - seaLevel;
  
    if (height < 0) {
      // ocean floor – you can make this negative or flat
      return height * 10; // deep water (negative heights)
    }
  
    // 5) Scale land height
    const landHeight = height / (1 - seaLevel); // re-normalize above sea
    return landHeight * 30; // max mountain height
  }


  return (
    <div className="bg-black">
      {/* <button className="absolute z-2 p-5 rounded-2xl bg-black border border-white top-5 left-[50%] translate-x-[-50%]">change map</button> */}
      <Scene size={board.heightmap.size} coords={board.heightmap.coords}/>
    </div>
  );
}
