import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/clases/user';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public usuario:User;
  public password!:string;

  constructor() {
    document.title = "Registro";
    this.usuario = new User(0,'','','',0,'','','','');
  }

  ngOnInit(): void {
  }
  onSubmit(formContacto:NgForm){
    console.log(formContacto)
  }

}
