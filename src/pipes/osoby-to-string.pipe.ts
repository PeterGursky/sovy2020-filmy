import { Pipe, PipeTransform } from '@angular/core';
import { Osoba } from 'src/entities/osoba';

@Pipe({
  name: 'osobyToString'
})
export class OsobyToStringPipe implements PipeTransform {

  transform(osoby: Osoba[]): string {
    return osoby.map(osoba => osoba.krstneMeno + " " 
                           + (osoba.stredneMeno || "") + " " 
                           + osoba.priezvisko).join(", ");
  }

}
