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
import { EditarComponent } from '../modales/editar/editar/editar.component';


@Component({
  selector: 'app-sesion',
  templateUrl: './sesion.component.html',
  styleUrls: ['./sesion.component.css']
})
export class SesionComponent implements OnInit {
  public pistas:Pista[];
  public reservas:Reserva[];
  public options!: FormGroup;
  public user: User;
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
          this._alertaService.openAlert("El correo o la contraseña no son correctos!!");
        }
      }

    );

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
  abrirEditar(){
    const modalRef = this.dialog.open(EditarComponent,{data:{user:this.user},disableClose: true});
    modalRef.afterClosed().subscribe((response) => {

      if (response) {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this._alertaService.openAlert('Perfil modificado correctamente');
      }

    });
  }

}
