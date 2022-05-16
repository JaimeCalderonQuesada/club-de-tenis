import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CambiarComponent } from '../cambiar/cambiar.component';
import { PasarelaComponent } from '../pasarela/pasarela.component';
import { Registrar } from '../../../clases/registrar';
import { Clase } from '../../../clases/clase';
import { ClaseService } from 'src/app/services/clase/clase.service';
import { RegistrarService } from '../../../services/registrar/registrar.service';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  public registrar:Registrar = new Registrar();
  public precio:number;
  public edad:number;
  public categoria:string;
  public meses:Array<string>;
  public mesesMostrar:Array<string>;
  public clases:Clase[];

  constructor(private _registrarService:RegistrarService,private _claseService:ClaseService,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<CambiarComponent>) {
    this.meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const today:Date = new Date();
    this.mesesMostrar = this.meses.slice(today.getMonth()+1,this.meses.length);
    this.mesesMostrar.push(...this.meses.slice(0,today.getMonth()+1))
    console.log(this.mesesMostrar)
    const cumple:Date = new Date(data.user.fecha);
    this.edad =today.getFullYear() - cumple.getFullYear();
    const mes:number = today.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && today.getDate() < cumple.getDate())) {
      this.edad--;
    }
    if(this.edad > 0 && this.edad <= 10){
      this.categoria = "Benjamin";
      this.precio = 35;
    }else if(this.edad === 11 || this.edad === 12){
      this.categoria = "Alevin";
      this.precio = 38;
    }else if(this.edad > 12 && this.edad < 17){
      this.categoria = "Infantil/Cadete";
      this.precio = 40;
    }else if(this.edad > 16 && this.edad < 19){
      this.categoria = "Juvenil";
      this.precio = 40;
    }else if(this.edad > 18){
      this.categoria = "Adultos";
      this.precio = 45;
    }

    this._claseService.getClases().subscribe(res=>{this.clases = res});
    
  }

  ngOnInit(): void {
  }

  apuntarse(){
    let array:Array<string> = [];
    let a = document.getElementsByClassName("form-check-input");
    for (let index = 0; index < a.length; index++) {
      const element = <HTMLInputElement> a[index];
      if(element.checked){
        array.push(element.value);
      }
    }
    this.precio = this.precio * array.length;
    this.dialogRef.close(true);
    console.log(array)
    const modalRef = this.dialog.open(PasarelaComponent,{data:{apuntarse:array,precio:this.precio},disableClose: true});
      modalRef.afterClosed().subscribe((response) => {

        if (response) {
          let mesesAinscribir:Array<number> = [];
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            for (let i = 0; i < this.meses.length; i++) {
              const element = this.meses[i];
              if(array[index] == this.meses[i]){
                mesesAinscribir.push(i)
              }
            }
          }
        
          for(let i=0;i<mesesAinscribir.length;i++){
            for(let a=0;a<this.clases.length;a++){
              console.log(new Date(this.clases[a].fecha).getMonth())
              if(new Date(this.clases[a].fecha).getMonth() == mesesAinscribir[i] && this.clases[a].tipo==this.categoria){
                this.registrar.usuario_id = this.data.user.id;
                this.registrar.clase_id = this.clases[a].id;
                this._registrarService.insertarRegistro(this.registrar).subscribe();
              }
            }
          }
        }

      })
  }

}
