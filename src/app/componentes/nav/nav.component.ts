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
   this._usuariosService.existe.subscribe(res=>this.user=res)
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }

}
