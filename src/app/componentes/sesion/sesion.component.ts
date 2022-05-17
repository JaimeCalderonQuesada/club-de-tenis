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
import { Inscribir } from 'src/app/clases/inscribir';
import { Torneo } from 'src/app/clases/torneo';
import { InscribirService } from 'src/app/services/inscribir/inscribir.service';
import { TorneoService } from 'src/app/services/torneo/torneo.service';
import { RegistrarService } from 'src/app/services/registrar/registrar.service';
import { Clase } from '../../clases/clase';
import { ClaseService } from '../../services/clase/clase.service';


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
  public verTorneos:Boolean=false;
  public verClases:Boolean=false;
  public usuarios:User[]=[];
  public page:number;
  public pageTorneos:number;
  public pageClases:number;
  public torneos:Torneo[] = [];
  public mistorneos:Torneo[] = [];
  public clases:Clase[] = [];
  public misclases:Clase[] = [];
  public inscripciones:Inscribir[];

  constructor(private _claseService:ClaseService,private _registrarService:RegistrarService,private _alertaService:AlertaService,private _pistaService:PistaService,private _reservaService:ReservaService,public dialog: MatDialog,public utils:Utils,private fb: FormBuilder,private _usuariosService:UsuariosService,private router:Router,private _inscribirService:InscribirService,private _torneoService:TorneoService) {
    document.title = "Iniciar Sesión";
    this.options = this.fb.group({
      password:["",[Validators.required,Validators.maxLength(100),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/)]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]]
    });

  }

  ngOnInit(): void {
          let busca;
          let micookie;
          let igual;
          let valor;
          let listaCookies = document.cookie.split(";");
          for (let i in listaCookies) {
            busca = listaCookies[i].search("user");
            if (busca > -1) {micookie=listaCookies[i]
              igual = micookie.indexOf("=");
              valor = micookie.substring(igual+1);}
          }
    if(valor){
      this.user = JSON.parse(valor);
    }else{
      this.user = JSON.parse(sessionStorage.getItem("user"));
    }
    if(this.user){
    if(this.user.tipo==1){
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

            this._inscribirService.getInscripciones().subscribe((res:Inscribir[])=>{
              this.inscripciones = res;
              this._torneoService.getTorneos().subscribe(res=>{
                this.torneos=res
                if(this.inscripciones.length>0){
                    for(let i=0;i<this.inscripciones.length;i++){

                      for(let index=0;index<this.torneos.length;index++){
                        if(this.inscripciones[i].usuario_id == this.user.id && this.torneos[index].id == this.inscripciones[i].torneo_id){
                          this.torneos[index].inscrito = true;
                          this.mistorneos.push(this.torneos[index]);
                        }
                      }
                    };
                    if(this.mistorneos.length>0){
                      this.verTorneos=true;
                    }
                }
                this._claseService.getClases().subscribe(res=>{
                  this.clases = res;
                  this._registrarService.getRegistro(this.user.id).subscribe(res=>{
                    if(res){
                      this.verClases = true;
                      for (let index = 0; index < res.length; index++) {
                        for(let i=0;i<this.clases.length;i++)
                          if(this.clases[i].id == res[index].clase_id){
                            for(let a=0;a<this.pistas.length;a++){
                              if(this.clases[i].pista_id == this.pistas[a].id){
                                this.clases[i].pista = this.pistas[a].name;
                              }
                            }
                            this.misclases.push(this.clases[i]);
                        }
                      }

                    }

                  })

                })
              });
            });
          });
        }

      },
      error=>{
        console.log(error)
        this._pistaService.getPistas().subscribe(resp=>{
          this.pistas=resp;

          this._inscribirService.getInscripciones().subscribe((res:Inscribir[])=>{
            this.inscripciones = res;
            this._torneoService.getTorneos().subscribe(res=>{
              this.torneos=res
              if(this.inscripciones.length>0){
                  for(let i=0;i<this.inscripciones.length;i++){

                    for(let index=0;index<this.torneos.length;index++){
                      if(this.inscripciones[i].usuario_id == this.user.id && this.torneos[index].id == this.inscripciones[i].torneo_id){
                        this.torneos[index].inscrito = true;
                        this.mistorneos.push(this.torneos[index]);
                      }
                    }
                  };
                  if(this.mistorneos.length>0){
                    this.verTorneos=true;
                  }
              }
              this._claseService.getClases().subscribe(res=>{
                this.clases = res;
                this._registrarService.getRegistro(this.user.id).subscribe(res=>{
                  if(res){

                    for (let index = 0; index < res.length; index++) {
                      for(let i=0;i<this.clases.length;i++)
                        if(this.clases[i].id == res[index].clase_id){
                          for(let a=0;a<this.pistas.length;a++){
                            if(this.clases[i].pista_id == this.pistas[a].id){
                              this.clases[i].pista = this.pistas[a].name;
                            }
                          }
                          this.misclases.push(this.clases[i]);
                      }
                    }
                    this.verClases = true;
                  }

                })

              })
            });
          });
        });
      }
      );
    }

    if(this.user.tipo==0){
      this._usuariosService.getUsuarios().subscribe(res=>this.usuarios=res)
    }
    }

  }

  onSubmit(){
    this._usuariosService.login(this.options.get('email')?.value,this.options.get('password')?.value).subscribe(
      result => {
        // Handle result
        if(result){
          let ele = <HTMLInputElement> document.getElementById("check");
          if(ele.checked){
          let expires = (new Date(Date.now()+ 86400*30000)).toUTCString();
          document.cookie =  "user="+JSON.stringify(result[0][0])+";expires="+expires;
          document.cookie =  "con="+JSON.stringify(result[1])+";expires="+expires;
          let busca;
          let micookie;
          let igual;
          let valor;
          let listaCookies = document.cookie.split(";");
          for (let i in listaCookies) {
            busca = listaCookies[i].search("user");
            if (busca > -1) {micookie=listaCookies[i]
              igual = micookie.indexOf("=");
              valor = micookie.substring(igual+1);
            }

          }
          this.user = JSON.parse(valor);
        }else{
          sessionStorage.setItem("user",JSON.stringify(result[0][0]));
          sessionStorage.setItem("con",JSON.stringify(result[1]));
          this.user = result[0][0];
        }
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
    document.cookie =  "user="+";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =  "con="+";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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
        let busca;
          let micookie;
          let igual;
          let valor;
          let listaCookies = document.cookie.split(";");
          for (let i in listaCookies) {
            busca = listaCookies[i].search("user");
            if (busca > -1) {micookie=listaCookies[i]
              igual = micookie.indexOf("=");
              valor = micookie.substring(igual+1);}
          }
          if(valor){
            this.user = JSON.parse(valor);
          }else{
            this.user = JSON.parse(sessionStorage.getItem("user"));
          }

        this._alertaService.openAlert('Perfil modificado correctamente');
      }

    });
  }

  borrarUsuario(id:number,index:number){
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._usuariosService.borrarUsuario(id).subscribe(()=>{
          if(this.user.id == id){
            this._usuariosService.existe.next(false);
            this.user=undefined;
            document.cookie =  "user="+";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie =  "con="+";expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            sessionStorage.clear();
            let currentUrl = this.router.url;
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([currentUrl]);

          });
          }
          this._alertaService.openAlert('Usuario eliminado correctamente');
          this.usuarios.splice(index,1);
          if(this.usuarios.length==5){
            this.page = 1;
          }
        });
      }
    });


  }

  mostrarPassword(input:string){
    let p = document.getElementById(input);
    if (p.attributes[2].value === "password") {
      p.attributes[2].value = "text";
    } else {
      p.attributes[2].value = "password";
    }
  }
  pageChanged(event:any){
    this.page = event;
  }
}
