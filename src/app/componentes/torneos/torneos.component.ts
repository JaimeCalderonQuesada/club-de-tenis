import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarUtils } from 'angular-calendar';
import { Reserva } from 'src/app/clases/reserva';
import { Torneo } from 'src/app/clases/torneo';
import { User } from 'src/app/clases/user';
import { AlertaService } from 'src/app/services/alerta/alerta.service';
import { InscribirService } from 'src/app/services/inscribir/inscribir.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { Utils } from 'src/app/utils';
import { TorneoService } from '../../services/torneo/torneo.service';
import { Inscribir } from '../../clases/inscribir';
import { TorneoComponent } from '../modales/torneo/torneo.component';
import { PasarelaComponent } from '../modales/pasarela/pasarela.component';

@Component({
  selector: 'app-torneos',
  templateUrl: './torneos.component.html',
  styleUrls: ['./torneos.component.css']
})
export class TorneosComponent implements OnInit,AfterViewChecked {
  public user:User;
  public torneos:Torneo[] = [];
  public inscripciones:Inscribir[];
  public inscripcionesTodas:Inscribir[];
  public usuarios:User[];
  public verInscripciones:Boolean=false;
  public inscribir:Inscribir = new Inscribir();
  public page:number;
  public pageTorneos:number;
  public buscar:string="";
  public select:string="ascendente";
  public filtrados:Inscribir[]=[];
  public torneo:string="";
  public verDatos:Boolean;

  constructor(
    private _alertaService:AlertaService,
    private _inscribirService:InscribirService,
    private _sanitizer: DomSanitizer,
    public util:Utils,
    public dialog: MatDialog,
    protected utils: CalendarUtils,
    private _usuariosService:UsuariosService,
    private _torneoService:TorneoService,
    private cdr: ChangeDetectorRef
    ) {
      document.title = "Torneos";
    }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this._usuariosService.page.subscribe(res=>this.page = res);
    this._usuariosService.verDatos.subscribe((res)=>{
        this.verDatos=res
    })
    this._torneoService.getTorneos().subscribe(res=>{
      this.torneos=res
      for(let i =0;i<this.torneos.length;i++){
        this.torneos[i].url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.torneos[i].imagen);
      }
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
          if(valor){
            this.user = JSON.parse(valor);
          }else{
            this.user = JSON.parse(sessionStorage.getItem("user"));
          }
      if(this.user){
              this._inscribirService.getInscripciones().subscribe((res:Inscribir[])=>{
                this.inscripciones = res;

                this._usuariosService.getUsuarios().subscribe(res=>{
                  this.usuarios=res
                  if(this.inscripciones.length>0){
                    this.verInscripciones=true;
                      for(let i=0;i<this.inscripciones.length;i++){

                        for(let index=0;index<this.torneos.length;index++){
                          if(this.inscripciones[i].usuario_id == this.user.id && this.torneos[index].id == this.inscripciones[i].torneo_id){
                            this.torneos[index].inscrito = true;
                          }
                          if(this.inscripciones[i].torneo_id == this.torneos[index].id){
                            this.inscripciones[i].torneo = this.torneos[index].name;
                          }
                        }
                        for(let u=0;u<this.usuarios.length;u++){
                          if(this.inscripciones[i].usuario_id == this.usuarios[u].id){
                            this.inscripciones[i].name = this.usuarios[u].name;
                          }
                        }
                      };

                  }
                });
                this.inscripcionesTodas = this.inscripciones;
              });
      }
    },()=>{
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
          if(valor){
            this.user = JSON.parse(valor);
          }else{
            this.user = JSON.parse(sessionStorage.getItem("user"));
          }
      if(this.user){
              this._inscribirService.getInscripciones().subscribe((res:Inscribir[])=>{
                this.inscripciones = res;
                this._usuariosService.getUsuarios().subscribe(res=>{
                  this.usuarios=res
                  if(this.inscripciones.length>0){
                    this.verInscripciones=true;
                      for(let i=0;i<this.inscripciones.length;i++){

                        for(let index=0;index<this.torneos.length;index++){
                          if(this.inscripciones[i].usuario_id == this.user.id && this.torneos[index].id == this.inscripciones[i].torneo_id){
                            this.torneos[index].inscrito = true;
                          }
                          if(this.inscripciones[i].torneo_id == this.torneos[index].id){
                            this.inscripciones[i].torneo = this.torneos[index].name;
                          }
                        }
                        for(let u=0;u<this.usuarios.length;u++){
                          if(this.inscripciones[i].usuario_id == this.usuarios[u].id){
                            this.inscripciones[i].name = this.usuarios[u].name;
                          }
                        }
                      };

                  }
                });

              });
      }
    });

  }

  borrarInscripcion(inscripcion:Inscribir){
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._inscribirService.borrarInscripcion(inscripcion).subscribe();
        this.inscripciones = this.inscripciones.filter((item)=>item != inscripcion)
        if(this.inscripciones.length==0){
          this.verInscripciones=false;
        }
        this._alertaService.openAlert('Inscripcion eliminada correctamente');
        this.page = 1;

      }
    })

  }
  abrirNuevoTorneo(){
    const modalRef = this.dialog.open(TorneoComponent,{disableClose: true});
    modalRef.afterClosed().subscribe((response) => {

      if (response) {

        this.torneos=[];
        this._torneoService.getTorneos().subscribe(res=>{
          this.torneos=[];
          this.torneos=res;
          for(let i =0;i<this.torneos.length;i++){
            this.torneos[i].url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.torneos[i].imagen);
          }
        });

      }

    });
  }
  borrarTorneo(index:number,id:number){
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._torneoService.borrarTorneo(id).subscribe();
        this.torneos.splice(index,1);

        this._inscribirService.getInscripciones().subscribe((res:Inscribir[])=>{
          this.inscripciones = res;
          this._usuariosService.getUsuarios().subscribe(res=>{
            this.usuarios=res
            if(this.inscripciones.length>0){
              this.verInscripciones=true;
                for(let i=0;i<this.inscripciones.length;i++){

                  for(let index=0;index<this.torneos.length;index++){
                    if(this.inscripciones[i].usuario_id == this.user.id && this.torneos[index].id == this.inscripciones[i].torneo_id){
                      this.torneos[index].inscrito = true;
                    }
                    if(this.inscripciones[i].torneo_id == this.torneos[index].id){
                      this.inscripciones[i].torneo = this.torneos[index].name;
                    }
                  }
                  for(let u=0;u<this.usuarios.length;u++){
                    if(this.inscripciones[i].usuario_id == this.usuarios[u].id){
                      this.inscripciones[i].name = this.usuarios[u].name;
                    }
                  }
                };
                this._alertaService.openAlert('Torneo eliminado correctamente');
                this.pageTorneos = 1;
                this.page = 1;
            }
          });

        });
      }
    });

  }
  editarTorneo(torneo:Torneo){
    const modalRef = this.dialog.open(TorneoComponent,{data:{torneo:torneo},disableClose: true});
    modalRef.afterClosed().subscribe((response) => {

      if (response) {
        this._torneoService.getTorneos().subscribe(res=>{
          this.torneos=res
          for(let i =0;i<this.torneos.length;i++){
            this.torneos[i].url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.torneos[i].imagen);
          }
        });

      }

    });
  }

  inscribirseTorneo(index:number,id:number){
    const modalRef = this.dialog.open(PasarelaComponent,{disableClose: true});
      modalRef.afterClosed().subscribe((response) => {

        if (response) {
          this._alertaService.openAlert("Inscripci??n realizada con exito");
          this.inscribir.torneo_id = id;
          this.inscribir.usuario_id = this.user.id;
          this._inscribirService.insertarInscripcion(this.inscribir).subscribe(()=>{
            this.torneos[index].inscrito = true;
          });
          this.pageTorneos=1;
        }

      });
  }
  pageChanged(event:any){
    console.log(event)
    this.page = event;
  }
  pageChangedTorneos(event:any){
    console.log(event)
    this.pageTorneos = event;
  }
  clicarTorneo(nombre:string){

    if(this.torneo.length==0){
      this.torneo = nombre;
      for(let i=0;i<this.inscripcionesTodas.length;i++){
        if(this.torneo == this.inscripcionesTodas[i].torneo){
          this.filtrados.push(this.inscripcionesTodas[i]);
        }
      }
      this.inscripciones = this.filtrados;
      if(this.inscripciones.length==0){
        this._usuariosService.verDatos.next(false);
      }else{
        this._usuariosService.verDatos.next(true);
      }
    }else if(this.torneo == nombre){
      this.filtrados = [];
      this.torneo="";
      this.inscripciones = this.inscripcionesTodas;
      this._usuariosService.verDatos.next(true);
    }else{
      this.filtrados = [];
      this.torneo=nombre;
      for(let i=0;i<this.inscripcionesTodas.length;i++){
        if(this.torneo == this.inscripcionesTodas[i].torneo){
          this.filtrados.push(this.inscripcionesTodas[i]);
        }
      }
      this.inscripciones = this.filtrados;
      if(this.inscripciones.length==0){
        this._usuariosService.verDatos.next(false);
      }else{
        this._usuariosService.verDatos.next(true);
      }
    }

  }
}
