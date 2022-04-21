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
  
  public options!: FormGroup;
  public user?: User;
 
  constructor(private fb: FormBuilder,private _usuariosService:UsuariosService,private router:Router) { 
    document.title = "Iniciar Sesión";
    this.options = this.fb.group({
      password:["",[Validators.required,Validators.maxLength(100),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/)]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    let u = JSON.parse(sessionStorage.getItem('user')!);
      if(u){
        this.user = u;
        console.log(u)
        this._usuariosService.setUser(u);
      }
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

  erroresPassword(){
    if(this.options.get('password')?.hasError('maxlength')){
      return 'El password debe tener máximo 100 caracteres.'
    }
    if(this.options.get('password')?.hasError('pattern')){
      return 'El password debe tener un formato correcto.'
    }
    return this.options.get('password')?.hasError('required') ? 'Campo requerido' : '';
  }

  

  onSubmit(){
    this._usuariosService.login(this.options.get('email')?.value,this.options.get('password')?.value).subscribe(
      (res:User)=>{
        let u = JSON.parse(sessionStorage.getItem('user')!);
      if(u){
        this.user = u;
        console.log(u)
        this._usuariosService.setUser(u);
      }else{
        sessionStorage.setItem('user',JSON.stringify(res));
        this.user = res;
        this._usuariosService.setUser(this.user);
      };
        this.options.reset();
        this.router.navigate(['/home']);
        this._usuariosService.existe.next(true);
      }
      
    );
    
  }

  logout(){
    this.user=undefined;
    sessionStorage.removeItem('user');
    sessionStorage.clear();
    this._usuariosService.setUser(this.user!);
    let currentUrl = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
      });
  }

}
