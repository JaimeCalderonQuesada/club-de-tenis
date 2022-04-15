import { Component, OnInit } from '@angular/core';
import { Contacto } from 'src/app/clases/contacto';
import { ContactoService } from 'src/app/services/contacto/contacto.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  public contacto:Contacto;

  constructor(private _servicioContacto:ContactoService) {
    this.contacto = new Contacto(0,'','','');
   }

  ngOnInit(): void {
  }

  onSubmit(){

    this._servicioContacto.insertarContacto(this.contacto).subscribe();
    console.log(this.contacto);
  }
}
