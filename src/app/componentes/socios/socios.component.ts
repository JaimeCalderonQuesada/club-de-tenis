import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Clase } from 'src/app/clases/clase';
import { User } from 'src/app/clases/user';
import { ClaseService } from 'src/app/services/clase/clase.service';
import { RegistrarService } from 'src/app/services/registrar/registrar.service';
import { ClasesComponent } from '../modales/clases/clases.component';
import { Registrar } from '../../clases/registrar';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { AlertaService } from 'src/app/services/alerta/alerta.service';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {
  public user:User;
  public edad:number;
  public verClases:Boolean=false;
  public clases:Clase[] = [];
  public registros:Registrar[];
  public usuarios:User[];
  public page:number;

  constructor(private _alertaService:AlertaService,private _usuariosService:UsuariosService,private _claseService:ClaseService,private _registrarService:RegistrarService,public dialog: MatDialog) {document.title = "Clases"; }

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
            valor = micookie.substring(igual+1);
          }
        }

        if(valor){
          this.user = JSON.parse(valor);
        }else{
          this.user = JSON.parse(sessionStorage.getItem("user"));
        }

        if(this.user && this.user.tipo == 0){

          this._claseService.getClases().subscribe(res=>{
            this.clases = res;
            this._registrarService.getRegistros().subscribe(resp=>{

              if(resp){
                this.registros = resp;

                this._usuariosService.getUsuarios().subscribe(respu=>{
                  this.usuarios=respu

                    for (let index = 0; index < this.registros.length; index++) {
                      for(let a=0;a<this.usuarios.length;a++){
                        if(this.usuarios[a].id == this.registros[index].usuario_id){
                          this.registros[index].usuario = this.usuarios[a].name;
                        }
                      }
                      for(let i=0;i<this.clases.length;i++){
                        if(this.clases[i].id == this.registros[index].clase_id){
                          this.registros[index].tipo = this.clases[i].tipo;
                          this.registros[index].fecha = this.clases[i].fecha;
                        }
                      }
                    }
                })
                this.verClases = true;
              }
            })
          })
        }

  }

  abrirApuntarse(){


    const modalRef = this.dialog.open(ClasesComponent,{data:{user:this.user},disableClose: true});
    modalRef.afterClosed().subscribe((response) => {
    });
  }
  borrarRegistro(registro:Registrar,icontrol:number){
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._registrarService.borrarRegistro(registro).subscribe();
        this.registros.splice(icontrol,1);
        if(this.registros.length==0){
          this.verClases=false;
        }
        this._alertaService.openAlert('Registro eliminado correctamente');
        this.page = 1;
      }
    })
  }

}
