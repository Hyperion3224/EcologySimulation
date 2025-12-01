import { EntityBase } from "./entities/entity.base"
import { Plant } from "./entities/plant";
import { Test } from "./entities/test";
import { Board } from "./map/board";
import { makeRecord } from "./utilities/FactoryFunctions";

export class World {
    entities: Record<string, EntityBase[]>;
    board: Board;

    constructor(size: {x: number, z: number}, heightFn: (x:number, z:number) => number){
        this.board = new Board(size, heightFn)

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
        const lastIndex = this.plants.length;
        for(let i = 0; i < num; i++){
            this.plants.push(Test.createTest((lastIndex+i), {position: this.board.randomPos(), facing: this.board.randomPos()}))
        }
    }

    get plants()    { return this.entities.plant}
    get herbs()     { return this.entities.herb}
    get omnis()     { return this.entities.omni}
    get carns()     { return this.entities.carn}
    get tests()     { return this.entities.test}
    get size()      { return this.board.heightmap.size};
    get xCenter()   { return this.size.x/2};
    get zCenter()   { return this.size.z/2};
    get randomPos() { return this.board.randomPos()}
    get center()   { return {x: Math.floor(this.size.x/2), y: this.board.heightmap.coords[Math.floor(this.size.x/2)][Math.floor(this.size.z/2)], z: Math.floor(this.size.x/2)}}
    get allEntities()  { return ([] as EntityBase[]).concat(
        this.plants, this.herbs, this.omnis, this.carns, this.tests)}
}