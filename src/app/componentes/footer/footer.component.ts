import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Contacto } from 'src/app/clases/contacto';
import { ContactoService } from 'src/app/services/contacto/contacto.service';
import { Utils } from '../../utils';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  
  
  constructor() {
    

   }

  ngOnInit(): void {
  }
  
  
}
