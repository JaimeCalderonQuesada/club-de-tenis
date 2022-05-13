import { Component } from '@angular/core';
import { User } from './clases/user';
import { UsuariosService } from './services/usuarios/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public user:User;
  title = 'club-de-tenis';
  constructor(private _usuariosService:UsuariosService){
    let busca;
    let micookie;
    let igual;
    let valor;
    let listaCookies = document.cookie.split(";");
    for (let i in listaCookies) {
      busca = listaCookies[i].search("user");
      if (busca > -1) {micookie=listaCookies[i]
        igual = micookie.indexOf("=");
        valor = micookie.substring(igual+1);}
    }

    if(valor){
        this.user = JSON.parse(valor);
        
    }else{
        this.user = JSON.parse(sessionStorage.getItem("user"));
        
    }
    if(this.user){
      this._usuariosService.existe.next(true);
    }
  }
  
}
