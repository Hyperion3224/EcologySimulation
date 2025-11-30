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

    randomPos = ()=>{
        const X: number = Math.floor(Math.random() * this.heightmap.size.x);
        const Y: number = Math.floor(Math.random() * this.heightmap.size.y);
        const Z: number = this.heightmap.coords[X][Y];
        
        return {x: X, y: Y, z: Z};
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