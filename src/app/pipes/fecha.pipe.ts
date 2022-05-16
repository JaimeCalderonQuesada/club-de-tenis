import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: Array<any>, filterBy: string): Array<any> {
    let newVal = value.sort((a: any, b: any) => {
      let date1 = new Date(a.fecha);
      let date2 = new Date(b.fecha);
      
      if(filterBy == "ascendente"){
        if (date1 > date2) {
          return 1;
      } else if (date1 < date2) {
          return -1;
      } else {
          return 0;
      }
      }else{
        if (date2 > date1) {
          return 1;
        } else if (date2 < date1) {
          return -1;
        } else {
          return 0;
        }
      }
    });
    return newVal;

  }

}
