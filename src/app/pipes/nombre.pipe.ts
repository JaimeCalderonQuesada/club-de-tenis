import { Pipe, PipeTransform } from '@angular/core';
import { UsuariosService } from '../services/usuarios/usuarios.service';

@Pipe({
  name: 'nombre'
})
export class NombrePipe implements PipeTransform {
  constructor(private _usuarioService:UsuariosService){}
  transform(value: Array<any>,filterBy: string): Array<any> {
    
    const filter = filterBy ? filterBy.toLocaleLowerCase() : null;
    if (filter) {
      
      if(filter.length > 2){
        if(value.filter(prod => prod.name.toLocaleLowerCase().includes(filter)).length==0){
          this._usuarioService.verDatos.next(false);
          return value;
        }else{
          this._usuarioService.page.next(1);
          this._usuarioService.verDatos.next(true);
          
          return value.filter(prod => prod.name.toLocaleLowerCase().includes(filter));
        }
      }else{
        this._usuarioService.verDatos.next(true);
        return value;
      }

    }
    else{
      return value;
    }

}
}