import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Clase } from 'src/app/clases/clase';
import { User } from 'src/app/clases/user';
import { ClaseService } from 'src/app/services/clase/clase.service';
import { RegistrarService } from 'src/app/services/registrar/registrar.service';
import { ClasesComponent } from '../modales/clases/clases.component';
import { Registrar } from '../../clases/registrar';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';

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
  public clasesRegistradas:Clase[] = [];
  public registros:Registrar[];
  public usuarios:User[];
  public page:number;

  constructor(private _usuariosService:UsuariosService,private _claseService:ClaseService,private _registrarService:RegistrarService,public dialog: MatDialog) {document.title = "Clases"; }

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
            this._registrarService.getRegistros().subscribe(res=>{
              
              if(res){
                this.registros = res;
                
                this._usuariosService.getUsuarios().subscribe(res=>{
                  this.usuarios=res
                  for (let index = 0; index < this.registros.length; index++) {
                    for(let i=0;i<this.clases.length;i++){
                      for(let a=0;a<this.usuarios.length;a++){
                        if(this.clases[i].id == this.registros[index].clase_id && this.registros[index].usuario_id == this.usuarios[a].id){
                            this.clases[i].usuario = this.usuarios[a].name;
                            this.clasesRegistradas.push(this.clases[i]);
                            console.log(this.clases[i])
                            console.log(this.clasesRegistradas)
                        }
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

      if (response) {
        
      }

    });
  }
  borrarRegistro(id:number,index:number){

  }

}
