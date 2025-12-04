import { size } from "./size";

export interface Heightmap {
    coords: number[][],
    height_function: (x: number, z:number) => number,
    size: size;
}