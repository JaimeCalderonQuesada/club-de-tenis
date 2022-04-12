import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public nombre!:string;
  public email!:string;
  public mensaje!:string;


  constructor() { }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.nombre + this.email + this.mensaje)
  }
}
