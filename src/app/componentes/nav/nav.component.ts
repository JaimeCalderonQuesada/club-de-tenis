import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/clases/user';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public user?:Boolean;
  constructor(private _usuariosService:UsuariosService) { }


  ngOnInit(): void {
    let busca;
          let micookie;
          let igual;
          let valor;
          let listaCookies = document.cookie.split(";");
          for (let i in listaCookies) {
            busca = listaCookies[i].search("user");
            if (busca > -1) {micookie=listaCookies[i];
              igual = micookie.indexOf("=");
              valor = micookie.substring(igual+1);}


          }
    if(valor){
    this.user = JSON.parse(valor);
    }
  }

}
