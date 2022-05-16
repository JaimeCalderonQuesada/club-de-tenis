import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nombre'
})
export class NombrePipe implements PipeTransform {

  transform(value: Array<any>,filterBy: string): Array<any> {
    const filter = filterBy ? filterBy.toLocaleLowerCase() : null;
    if (filter) {
      if(filter.length > 2){
        return value
        .filter(prod => prod.name.toLocaleLowerCase().includes(filter))
      }
    }
    return value;
  }

}
