import Scene from "./scene";
import { Board } from "./map/board";

export default function Home() {
  
  const board = new Board({x: 10, y:10}, (x,y)=>{
    return x+y
  })

  return (
    <div>
      <Scene size={board.heightmap.size} coords={board.heightmap.coords}/>
    </div>
  );
}
