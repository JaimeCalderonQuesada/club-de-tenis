import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { User } from '../../clases/user';


@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {

  public modificar:Boolean=false;

  public options!: FormGroup;
  public editar!: FormGroup;
  public user: User;
  public correcto:Boolean=false;

  constructor(private fb: FormBuilder,private _usuariosService:UsuariosService,private router:Router) {
    document.title = "Iniciar Sesión";
    this.options = this.fb.group({
      password:["",[Validators.required,Validators.maxLength(100),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/)]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]]
    });

  }

  ngOnInit(): void {
    if(sessionStorage.length>0){
      this.user = JSON.parse(sessionStorage.getItem('user'))[0];
      this.editar = this.fb.group({
        name: [this.user.name,[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
        email: [this.user.email,[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
        movil:[this.user.movil,[Validators.required,Validators.pattern(/^[679]{1}[0-9]{8}$/)]],
        dni:[this.user.dni,[Validators.required,Validators.pattern(/^(\d{8})([A-Z])$/)]]
      });
    }

  }

  erroresEmailLogin(){
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

  erroresPassword(){
    if(this.options.get('password')?.hasError('maxlength')){
      return 'El password debe tener máximo 100 caracteres.'
    }
    if(this.options.get('password')?.hasError('pattern')){
      return 'El password debe tener un formato correcto.'
    }
    return this.options.get('password')?.hasError('required') ? 'Campo requerido' : '';
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


  onSubmit(){
    this._usuariosService.login(this.options.get('email')?.value,this.options.get('password')?.value).subscribe(
      result => {
        // Handle result
        if(result){
          this.user = result;
          console.log(result);
          sessionStorage.setItem('user',JSON.stringify(result));
          this.options.reset();
          this.router.navigate(['/home']);
          this._usuariosService.existe.next(true);
        }
      },
      error => {
        console.log(error)
        if(error){
          this.correcto = true;
        }
      }

    );

  }
  onSubmitEditar(){
    this.modificar=false;
  }

  logout(){
    this.user=undefined;
    sessionStorage.removeItem('user');
    sessionStorage.clear();
    let currentUrl = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
      });
  }

}
