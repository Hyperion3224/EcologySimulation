import { entity, entityLocation } from "../interfaces";

export class EntityBase {
    constructor(private details: entity, location: entityLocation){
        details.location = location;
        details.derivedStats = fillStats(details.genome, details.species_averages, details.species_std);
    }

    getSpecies(){
        return this.details.species;
    }

    getLocation(){
        return this.details.location.position;
    }
}

type stats = {
    health: number,
    speed: number,
    strength: number,
    fertility: number,
    size: number,
    energy: number,
    sight: number, 
    locality_preferance: number,
}
function fillStats(genome: number[], sAvgs: number[], sSigs: number[]): stats{
    const rand = Math.random();
    const s: stats = {
        health: getStat(genome[0], sAvgs[0], sSigs[0]),
        speed: getStat(genome[1], sAvgs[1], sSigs[1]),
        strength: getStat(genome[2], sAvgs[2], sSigs[2]),
        fertility: getStat(genome[3], sAvgs[3], sSigs[3]),
        size: getStat(genome[4], sAvgs[4], sSigs[4]),
        energy: getStat(genome[5], sAvgs[5], sSigs[5]),
        sight: getStat(genome[6], sAvgs[6], sSigs[6]), 
        locality_preferance: (rand > .6) ? 1000 : (rand > .3) ? 8 : -1000,
    }

    return s;
}

function getStat(genotype:number, mu: number, sig: number): number{
    const genotype_offest = (genotype > 0.5) ? sig : (genotype == 0.5) ? 0 : -sig;
    const local_mean = mu + genotype_offest; 

    const normal = (mu: number, std: number) => {
        const u1 = 1 - Math.random();
        const u2 = 1 - Math.random();
        const z = Math.sqrt(-2 * Math.log(u1) * Math.cos(2 * Math.PI * u2))
        return mu + z * std;
    }
    return normal(local_mean, 0.5);
}