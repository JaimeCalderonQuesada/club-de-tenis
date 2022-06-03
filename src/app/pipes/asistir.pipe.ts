import { Pipe, PipeTransform } from '@angular/core';
import { UsuariosService } from '../services/usuarios/usuarios.service';

@Pipe({
  name: 'asistir'
})
export class AsistirPipe implements PipeTransform {
  constructor(private _usuarioService:UsuariosService){}
  transform(value: Array<any>, filterBy: number): Array<any> {

    let array = [];
    if(filterBy != 2){
      for(let i=0;i<value.length;i++){
        if(value[i].asistido == filterBy){
          array.push(value[i]);
        }
      }
      value = array;
      if(value.length==0){
        this._usuarioService.verDatos.next(false);
      }else{
        this._usuarioService.page.next(1);
        this._usuarioService.verDatos.next(true);
      }
      return value;
    }else{
      this._usuarioService.page.next(1);
      if(value.length==0){

        this._usuarioService.verDatos.next(false);
      }else{
        this._usuarioService.verDatos.next(true);
      }
      return value;
    }


  }

}
