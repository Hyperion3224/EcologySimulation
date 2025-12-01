import { EntityBase } from "../entities/entity.base";
import { size } from "../interfaces";

interface Heightmap {
    coords: number[][],
    height_function: (x: number, z:number) => number,
    size: size;
}

export class Board {
    public heightmap: Heightmap;
    
    constructor(size: size, height_function: (x: number,z: number) => number){
        this.heightmap={
            size,
            height_function,
            coords: []
        }
        
        this.load_heightmap();
    }

    randomPos = ()=>{
        const X: number = Math.floor(Math.random() * this.heightmap.size.x);
        const Z: number = Math.floor(Math.random() * this.heightmap.size.z);
        const Y: number = this.heightmap.coords[X][Z];
        
        return {x: X, y: Y, z: Z};
    }

    load_heightmap(){
        const { size, height_function } = this.heightmap;

        this.heightmap.coords = Array.from({ length: size.x }, () =>
            Array(size.z).fill(0)
        );

        for (let x = 0; x < this.heightmap.size.x; x++){
            for(let z = 0; z < this.heightmap.size.z; z++){
                this.heightmap.coords[x][z] = this.heightmap.height_function(x, z);
            }
        }
    }
}