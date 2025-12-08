import { EntityBase } from "./entities/entity.base"
import { Plant } from "./entities/plant";
import { Test } from "./entities/test";
import { ChunkManager } from "./map/chunkManager";
import { makeRecord } from "./utilities";

export class World {
    entities: Record<string, EntityBase[]>;
    chunkManager: ChunkManager;
    height: number;

    constructor(sideLen: number, chunkSize: number, worldHeight: number, heightFn: (x:number, z:number) => number){
        this.chunkManager = new ChunkManager(sideLen, chunkSize,(x: number,z: number) => {
            return (heightFn(x,z) * worldHeight);
        });
        this.height = worldHeight * 2;

        const all_entity_types = [
            "test",
            "herb",
            "omni",
            "carn",
            "plant"
        ]

        this.entities = makeRecord(all_entity_types, () => [])
    }

    getEntitiesInRadiusOf(target: {x:number, y:number, z:number}, radius: number): EntityBase[]{
        return this.allEntities.filter((entity) => {
            const location = entity.position;
            const dx = location.x - target.x;
            const dy = location.y - target.y;
            const dz = location.z - target.z;

            if(Math.sqrt(dx*dx + dy*dy + dz*dz) <= radius){
                return entity;
            }
        })
    }

    tick():void {
        this.allEntities.map((entity) => {
            entity.tick(this);
        })
    }

    addTest(num:number){
        const lastIndex = this.tests.length;
        for(let i = 0; i < num; i++){
            this.tests.push(Test.createTest((lastIndex+i), {position: this.chunkManager.randomPos(), facing: this.chunkManager.randomPos()}))
        }
    }

    get plants()    { return this.entities.plant}
    get herbs()     { return this.entities.herb}
    get omnis()     { return this.entities.omni}
    get carns()     { return this.entities.carn}
    get tests()     { return this.entities.test}
    get size()      { return this.chunkManager.maxSideLength * this.chunkManager.chunkSize};
    get xCenter()   { return this.size/2};
    get zCenter()   { return this.size/2};
    get randomPos() { return this.chunkManager.randomPos()}
    get allEntities()  { return ([] as EntityBase[]).concat(
        this.plants, this.herbs, this.omnis, this.carns, this.tests)}
}