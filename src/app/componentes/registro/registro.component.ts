import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { User } from 'src/app/clases/user';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public usuario:User;
  public options!: FormGroup;
  public fechaActual:Date;
  public user?:User;

  constructor(private fb: FormBuilder,private _usuariosService:UsuariosService,private route:Router) {

    this.fechaActual = new Date();
    document.title = "Registro";
    this.usuario = new User();
    this.options = this.fb.group({
      name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
      password:["",[Validators.required,Validators.maxLength(100),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/)]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
      sexo: ["",[Validators.required]],
      movil:["",[Validators.required,Validators.pattern(/^[679]{1}[0-9]{8}$/)]],
      dni:["",[Validators.required,Validators.pattern(/^(\d{8})([A-Z])$/)]],
      fecha:[,[Validators.required,Validators.max(this.fechaActual.getFullYear()-10),Validators.min(this.fechaActual.getFullYear()-100)]],
      password2:["",[Validators.required]]
    },{
      validators:this.MustMatch('password','password2')
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user')!);
  }

  MustMatch(controlName:string,matchingControlName:string) {
    return(formGroup:FormGroup)=>{
      const control = formGroup.controls[controlName];
      const matchingcontrol = formGroup.controls[matchingControlName];
      if(matchingcontrol.errors && !matchingcontrol.errors?.["MustMatch"]){
        return
      }
      if(control.value !== matchingcontrol.value){
        matchingcontrol.setErrors({MustMatch:true});
      }else{
        matchingcontrol.setErrors(null)
      }
    }
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

  erroresDni(){
    if(this.options.get('dni')?.hasError('pattern')){
      return 'El dni debe tener 8 numeros y una letra.'
    }
    return this.options.get('dni')?.hasError('required') ? 'Campo requerido' : '';
  }

  erroresMovil(){
    if(this.options.get('movil')?.hasError('pattern')){
      return 'El movil debe tener un formato correcto.'
    }
    return this.options.get('movil')?.hasError('required') ? 'Campo requerido' : '';
  }
  erroresFecha(){
    if(this.options.get('fecha')?.hasError('max')){
      return 'Debes tener más de 10 años.'
    }
    if(this.options.get('fecha')?.hasError('min')){
      return 'Debes tener menos de 100 años.'
    }
    return this.options.get('fecha')?.hasError('required') ? 'Campo requerido' : '';
  }
  erroresSexo(){
    return this.options.get('sexo')?.hasError('required') ? 'Campo requerido' : '';
  }
  erroresPassword(){
    if(this.options.get('password')?.hasError('maxlength')){
      return 'El password debe tener máximo 100 caracteres.'
    }
    if(this.options.get('password')?.hasError('pattern')){
      return 'El password debe tener un formato correcto.'
    }
    return this.options.get('password')?.hasError('required') ? 'Campo requerido' : '';
  }

  erroresPassword2(){
    if(this.options.get('password2')?.hasError('MustMatch')){
      return 'Las contraseñas no son iguales.'
    }
    return this.options.get('password2')?.hasError('required') ? 'Campo requerido' : '';
  }

  onSubmit(){
    this.usuario.tipo = 1;
    this.usuario.name = this.options.get('name')?.value;
    this.usuario.password = this.options.get('password')?.value;
    this.usuario.email = this.options.get('email')?.value;
    this.usuario.sexo = this.options.get('sexo')?.value;
    this.usuario.movil = this.options.get('movil')?.value;
    this.usuario.dni = this.options.get('dni')?.value;
    this.usuario.fecha = new Date(this.options.get('fecha')?.value);
    this._usuariosService.insertarUser(this.usuario).subscribe(
      result => {
        // Handle result
        if(result === 1062){
          alert("El dni o el email esta repetido.");
        }else{
          this.options.reset();
          this.route.navigate(['/sesion']);
        }
      },
      error => {
        console.log(error)
      }
    );
  }

}
