import Chunk from "./chunk";
import { Queue } from '../utilities'

export class ChunkManager {
    private curlen = 0;
    private index = 0;

    chunks =  new Map<{x:number, z:number}, Chunk>();
    chunkLoadQueue = new Queue<Chunk>()
    maxSideLength: number;
    chunkSize: number;
    height_function: any;
    hasNext = true;

    constructor(sideLen: number, chunkSize: number, height_function: (x:number, z:number) => number){
        if(sideLen <= 0){
            throw new Error("How can a side length be negative?")
        }
        
        this.maxSideLength = sideLen;
        this.chunkSize = chunkSize;
        this.height_function = height_function;
    }

    static async create(sideLen: number, chunkSize: number, height_function: (x:number, z:number) => number): Promise<ChunkManager>{
        const cm = new ChunkManager(sideLen, chunkSize, height_function);
        await cm.initChunk();
        return cm; 
    }

    async initChunk(){
        const centerChunk = await Chunk.create(this,0,0,this.chunkSize,this.height_function);
        this.chunks.set(centerChunk.chunkPosition, centerChunk);
        this.chunkLoadQueue.push(centerChunk);
    }

    async generateNextChunks(){
        if(this.maxSideLength == 1){return};
        if(this.curlen >= (this.maxSideLength)/2){
            this.hasNext = false;
            return;
        }

        const csLen = this.chunkSize * this.curlen;
        const dCSILen = this.chunkSize * this.index - csLen;
        const IChunk = await Chunk.create(this,dCSILen,csLen,this.chunkSize,this.height_function);
        const IIChunk = await Chunk.create(this,csLen,-dCSILen,this.chunkSize,this.height_function);
        const IIIChunk = await Chunk.create(this,-csLen,dCSILen,this.chunkSize,this.height_function);
        const IVChunk = await Chunk.create(this,-dCSILen,-csLen,this.chunkSize,this.height_function);

        this.addChunk(this.chunks, IChunk);
        this.addChunk(this.chunks, IIChunk);
        this.addChunk(this.chunks, IIIChunk);
        this.addChunk(this.chunks, IVChunk);

        this.chunkLoadQueue.push(IChunk);
        this.chunkLoadQueue.push(IIChunk);
        this.chunkLoadQueue.push(IIIChunk);
        this.chunkLoadQueue.push(IVChunk);

        if(this.index >= 2*this.curlen){
            this.curlen++;
            this.index = 0;
        } else{
            this.index++
        }
    }

    private addChunk(map: Map<{x: number, z: number}, Chunk>, chunk: Chunk): void {
        const pos = chunk.chunkPosition;
        if(map.has(pos)){
            return;
        }
        map.set(pos, chunk);
    }

    randomPos(): {x: number, y: number, z: number} {
        const xSign = (Math.random() > .5)? -1: 1;
        const zSign = (Math.random() > .5)? -1: 1;
        const X = Math.random()*((1/2)*this.maxSideLength*this.chunkSize*xSign);
        const Z = Math.random()*((1/2)*this.maxSideLength*this.chunkSize*zSign);
        const pos = {
            x: X, 
            y: this.height_function(X,Z), 
            z: Z
        }

        return pos;
    }
}