import { Osoba } from "./osoba";

export class Postava {
  constructor(
    public postava: string,
    public dolezitost,
    public herec: Osoba
  ){}
}