import { Osoba } from "./osoba";
import { Postava } from "./postava";

export class Film {
  constructor(
    public nazov: string,
    public rok: number,
    public id?: number,
    public slovenskyNazov?: string,
    public imdbID?: string,
    public reziser?: Osoba[],
    public postava?: Postava[],
    public poradieVRebricku?: { [title: string]: number}
  ){}
}