import { size } from "../interfaces";

interface Heightmap {
    coords: number[][],
    height_function: (x: number, y:number) => number,
    size: size;
}

export class Board {
    public heightmap: Heightmap;
    
    constructor(size: size, height_function: (x: number,y: number) => number){
        this.heightmap={
            size,
            height_function,
            coords: []
        }


        this.load_heightmap();
    }

    load_heightmap(){
        const { size, height_function } = this.heightmap;

        this.heightmap.coords = Array.from({ length: size.x }, () =>
            Array(size.y).fill(0)
        );

        for (let x = 0; x < this.heightmap.size.x; x++){
            for(let y = 0; y < this.heightmap.size.y; y++){
                this.heightmap.coords[x][y] = this.heightmap.height_function(x, y);
            }
        }
    }
}