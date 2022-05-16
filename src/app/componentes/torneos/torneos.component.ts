import { Component, OnInit } from '@angular/core';
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
export class TorneosComponent implements OnInit {
  public user:User;
  public torneos:Torneo[] = [];
  public inscripciones:Inscribir[];
  public usuarios:User[];
  public verInscripciones:Boolean=false;
  public inscribir:Inscribir = new Inscribir();
  public page:number;
  public pageTorneos:number;
  public buscar:string="";
  public select:string="ascendente";
  constructor(private _alertaService:AlertaService,private _inscribirService:InscribirService,private _sanitizer: DomSanitizer,public util:Utils,public dialog: MatDialog,protected utils: CalendarUtils,private fb: FormBuilder,private _usuariosService:UsuariosService,private _torneoService:TorneoService) {document.title = "Torneos"; }

  ngOnInit(): void {

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
                            this.inscripciones[i].usuario = this.usuarios[u].name;
                          }
                        }
                      };

                  }
                });

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
                            this.inscripciones[i].usuario = this.usuarios[u].name;
                          }
                        }
                      };

                  }
                });

              });
      }
    });

  }
  
  borrarInscripcion(icontrol:number,inscripcion:Inscribir){
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._inscribirService.borrarInscripcion(inscripcion).subscribe();
        this.inscripciones.splice(icontrol,1);
        if(this.inscripciones.length==0){
          this.verInscripciones=false;
        }
        this._alertaService.openAlert('Inscripcion eliminada correctamente');
        if(this.inscripciones.length==5){
          this.page = 1;
        }
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
        this._alertaService.openAlert('Torneo eliminado correctamente');
        if(this.torneos.length==5){
          this.pageTorneos = 1;
        }
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
    console.log(id)
    const modalRef = this.dialog.open(PasarelaComponent,{disableClose: true});
      modalRef.afterClosed().subscribe((response) => {

        if (response) {
          this.inscribir.torneo_id = id;
          this.inscribir.usuario_id = this.user.id;
          this._inscribirService.insertarInscripcion(this.inscribir).subscribe(()=>{
            this.torneos[index].inscrito = true;
          });
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
}
