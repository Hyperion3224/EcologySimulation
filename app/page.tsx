'use client';

import Scene from "./scene";
import TGEN from "./map/terraingen";
import { World } from "./world";
import { useRef } from "react";

export default function Home() {
  const terrainGenerator = new TGEN();
  const world = useRef(new World({x: 300,z: 300}, (x,z) => {
    return Math.floor((terrainGenerator.simplexOfN(x,z, 8)) * 27)}
  ));

  
  world.current.addTest(100);
  
  return (
    <div>
      <Scene world={world.current}/>
    </div>
  );
}
