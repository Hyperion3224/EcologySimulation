'use client';

import Scene from "./scene";
import { Board } from "./map/board";
import { Test } from './entities/test';
import { EntityBase } from "./entities/entity.base";
import TGEN from "./map/terraingen";

export default function Home() {
  const terrainGenerator = new TGEN();
  const board = new Board({x: 300, y:300}, (x,y)=>{
    //    https://cgvr.informatik.uni-bremen.de/teaching/cg_literatur/simplexnoise.pdf      pg.11
    return Math.floor((terrainGenerator.simplexOfN(x,y,10) + 1) * 27);
  })

  const entities: EntityBase[] = []

  for(let i = 0; i < 10; i++){
    entities.push(new Test({position: board.randomPos(), facing: board.randomPos()}));
  }

  return (
    <div>
      <Scene size={board.heightmap.size} coords={board.heightmap.coords} entities={entities}/>
    </div>
  );
}
