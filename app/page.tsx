'use client';

import Scene from "./scene";
import TGEN from "./map/terraingen";
import { World } from "./world";
import { useRef } from "react";

export default function Home() {
  const terrainGenerator = new TGEN();
  const world = useRef(new World(7,10,40,((x,z) => {
    return terrainGenerator.simplexOfN(x,z,8) + 1}
  )));

  
  world.current.addTest(100);
  
  return (
    <div>
      <Scene world={world.current}/>
    </div>
  );
}
