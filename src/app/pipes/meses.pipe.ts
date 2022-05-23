import { Pipe, PipeTransform } from '@angular/core';
import { UsuariosService } from '../services/usuarios/usuarios.service';

@Pipe({
  name: 'meses'
})
export class MesesPipe implements PipeTransform {
  constructor(private _usuarioService:UsuariosService){}
  transform(value: Array<any>, filterBy: number): Array<any> {
    
    let array = [];
    if(filterBy!= 13){
      for(let i=0;i<value.length;i++){
        if(new Date(value[i].fecha).getMonth() == filterBy){
          array.push(value[i]);
        }
      }
      value = array;
      if(value.length==0){
        console.log(value.length)
        this._usuarioService.verDatos.next(false);
      }else{
        this._usuarioService.verDatos.next(true);
        this._usuarioService.page.next(1);
      }
      return value;
    }else{
      this._usuarioService.page.next(1);
      if(value.length==0){
        console.log(value.length)
        this._usuarioService.verDatos.next(false);
      }else{
        this._usuarioService.verDatos.next(true);
      }
      return value;
    }
      
    
  }

}
