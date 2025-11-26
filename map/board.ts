import { size, heightmap } from "../interfaces";

export class board {
    public heightmap = {
        coords: [[],[]],
        height_function: ((x: number,y: number)=>{return 0}),
        size: {x:0, y:0}
    };
    
    constructor(size: size, height_function: (x: number,y: number) => number){
        this.heightmap.size = size;
        this.heightmap.height_function = height_function;
        this.load_heightmap();
    }

    load_heightmap(){
        for (let x = 0; x > this.heightmap.size.x; x++){
            for(let y = 0; y > this.heightmap.size.y; y++){
                heightmap.coords[x][y] = this.heightmap.height_function(x, y);
            }
        }
    }
}