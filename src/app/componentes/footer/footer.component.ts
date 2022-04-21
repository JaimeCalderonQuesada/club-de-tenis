import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Contacto } from 'src/app/clases/contacto';
import { ContactoService } from 'src/app/services/contacto/contacto.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public options!: FormGroup;
  public contacto:Contacto;

  constructor(private fb: FormBuilder,private _servicioContacto:ContactoService, private _fb: FormBuilder) {
    this.contacto = new Contacto('','','');
    this.options = this.fb.group({
      name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
      mensaje: ["",[Validators.required,Validators.minLength(10),Validators.maxLength(255)]]
    });

   }

  ngOnInit(): void {
  }
  errores(){
    if(this.options.get('name')?.hasError('pattern')){
      return 'Escriba un nombre y apellidos correcto.'
    }
    if(this.options.get('name')?.hasError('maxlength')){
      return 'El máximo son 100 caracteres.'
    }
    return this.options.get('name')?.hasError('required') ? 'Campo requerido' : '';
  }
  erroresEmail(){
    if(this.options.get('email')?.hasError('minlength')){
      return 'El email debe tener mínimo 10 caracteres.'
    }
    if(this.options.get('email')?.hasError('maxlength')){
      return 'El email debe tener máximo 100 caracteres.'
    }
    if(this.options.get('email')?.hasError('email')){
      return 'El email debe contener un @.'
    }
    return this.options.get('email')?.hasError('required') ? 'Campo requerido' : '';
  }

  erroresMensaje(){
    if(this.options.get('mensaje')?.hasError('minlength')){
      return 'El mensaje debe tener mínimo 10 caracteres.'
    }
    if(this.options.get('mensaje')?.hasError('maxlength')){
      return 'El mensaje debe tener máximo 255 caracteres.'
    }
    return this.options.get('mensaje')?.hasError('required') ? 'Campo requerido' : '';
  }
  onSubmit(){
    this.contacto.name = this.options.get('name')?.value;
    this.contacto.email = this.options.get('email')?.value;
    this.contacto.mensaje = this.options.get('mensaje')?.value;
    this._servicioContacto.insertarContacto(this.contacto).subscribe(
      result => {
        // Handle result
        console.log(result)
      },
      error => {
        console.log(error)
      },
      () => {
        this.options.reset();
      }
    );
    
  }
}
