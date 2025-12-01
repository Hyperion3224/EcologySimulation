
export type stat = {
    name: string;
    genotype: number;
    global_avg: number;
    global_std: number;
}

export default class Stat {
    private stat: stat;
    value: number;
    constructor (private _stat: stat){
        this.stat = _stat;
        if(_stat.genotype > 0){
            this.value = this.fillValue(this.stat.genotype, this.stat.global_avg, this.stat.global_std);
        } else {
            this.value = 0;
        }
    }

    fillValue (genotype:number, mu: number, sig: number): number{
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
}