import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { Utils } from 'src/app/utils';
import { User } from '../../clases/user';
import { CambiarComponent } from '../modales/cambiar/cambiar.component';
import { Reserva } from '../../clases/reserva';
import { Pista } from 'src/app/clases/pista';
import { PistaService } from 'src/app/services/pista/pista.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertaService } from '../../services/alerta/alerta.service';


@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {
  public pistas:Pista[];
  public modificar:Boolean=false;
  public reservas:Reserva[];
  public options!: FormGroup;
  public editar!: FormGroup;
  public user: User;
  public usuario:User = new User();
  public correcto:Boolean=false;
  public verReservas:Boolean=false;
  constructor(private _alertaService:AlertaService,private _pistaService:PistaService,private _reservaService:ReservaService,public dialog: MatDialog,public utils:Utils,private fb: FormBuilder,private _usuariosService:UsuariosService,private router:Router) {
    document.title = "Iniciar Sesión";
    this.options = this.fb.group({
      password:["",[Validators.required,Validators.maxLength(100),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/)]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]]
    });

  }

  ngOnInit(): void {
    if(sessionStorage.length>0){
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.editar = this.fb.group({
        name: [this.user.name,[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
        email: [this.user.email,[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
        movil:[this.user.movil,[Validators.required,Validators.pattern(/^[679]{1}[0-9]{8}$/)]]
      });
      this._reservaService.getReserva(this.user.id).subscribe((res:Reserva[])=>{
        this.reservas = res;
        if(this.reservas.length>0){
          this._pistaService.getPistas().subscribe(resp=>{
            this.pistas=resp;
            for(let i=0;i<this.reservas.length;i++){
              for(let index=0;index<this.pistas.length;index++){
                if(this.reservas[i].pista_id == this.pistas[index].id){
                  this.reservas[i].nombre = this.pistas[index].name;
                }
              }
            };
            this.verReservas=true;
          });
        }

      },
      error=>{console.log(error)}
      );


    }


  }




  onSubmit(){
    this._usuariosService.login(this.options.get('email')?.value,this.options.get('password')?.value).subscribe(
      result => {
        // Handle result
        if(result){
          console.log(result)
          this.user = result[0][0];
          sessionStorage.setItem('user',JSON.stringify(this.user));
          sessionStorage.setItem('con',JSON.stringify(result[1]));
          this.options.reset();
          this.router.navigate(['/home']);
          this._usuariosService.existe.next(true);
          this._alertaService.openAlert('Sesión iniciada correctamente');
        }
      },
      error => {
        if(error){
          this.correcto = true;
        }
      }

    );

  }
  onSubmitEditar(){

    this.usuario.name = this.editar.get('name')?.value;
    this.usuario.email = this.editar.get('email')?.value;
    this.usuario.movil = this.editar.get('movil')?.value;
    if(this.user.name == this.usuario.name && this.user.email == this.usuario.email && this.user.movil == this.usuario.movil){
      this.correcto =true;
    }else{
      this._usuariosService.modificarUser(this.usuario,this.user.id).subscribe(
        result => {
          // Handle result
          this._usuariosService.getUsuario(this.user.id).subscribe(
            (res:any)=>{
              sessionStorage.removeItem('user');
              sessionStorage.setItem('user',JSON.stringify(res[0]));
              this.user = res[0];
              this._alertaService.openAlert('Perfil editado correctamente');
            }
          )
          this.modificar=false;
          this.correcto =false;
        }
      )
    }



  }

  logout(){
    this._usuariosService.existe.next(false);
    this.user=undefined;
    sessionStorage.removeItem('user');
    sessionStorage.clear();
    let currentUrl = this.router.url;
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
      });
  }
  abrirModal(){
    const modalRef = this.dialog.open(CambiarComponent,{data:{user:this.user},disableClose: true});
    modalRef.afterClosed().subscribe((response) => {

      if (response) {
        this._alertaService.openAlert('Contraseña guardada correctamente');
      }

    });
  }
  volver(){
    this.modificar = false;
    this.correcto =false;
  }

}
