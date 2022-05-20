import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'meses'
})
export class MesesPipe implements PipeTransform {

  transform(value: Array<any>, filterBy: number): Array<any> {
    
    let array = [];
    if(filterBy!= 13){
      for(let i=0;i<value.length;i++){
        if(new Date(value[i].fecha).getMonth() == filterBy){
          array.push(value[i]);
        }
      }
      value = array
    }
    return value;
  }

}
