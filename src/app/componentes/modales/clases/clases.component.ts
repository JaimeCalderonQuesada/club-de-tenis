import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CambiarComponent } from '../cambiar/cambiar.component';
import { PasarelaComponent } from '../pasarela/pasarela.component';
import { Registrar } from '../../../clases/registrar';
import { Clase } from '../../../clases/clase';
import { ClaseService } from 'src/app/services/clase/clase.service';
import { RegistrarService } from '../../../services/registrar/registrar.service';
import { AlertaService } from '../../../services/alerta/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { Reserva } from 'src/app/clases/reserva';

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
  public year:number;
  public options!: FormGroup;
  public misReservas:Reserva[]=[];
  constructor(
    private fb: FormBuilder,
    private _alertaService:AlertaService,
    private _registrarService:RegistrarService,
    private _reservaService:ReservaService,
    private _claseService:ClaseService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<CambiarComponent>
    ) {
    this.options = this.fb.group({
      meses: [,[Validators.required]]
    });

    this.meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const today:Date = new Date();
    if(today.getMonth()+1 == this.meses.length){
      this.year = today.getFullYear()+1;
      this.mesesMostrar = this.meses;
    }else{
      this.year = today.getFullYear();
      this.mesesMostrar = this.meses.slice(today.getMonth()+1,this.meses.length);
    }

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

    this._claseService.getClases().subscribe(res=>{
      this.clases = res
      this._registrarService.getRegistro(this.data.user.id).subscribe(res=>{
        if(res){

          for (let index = 0; index < res.length; index++) {
            for(let i=0;i<this.clases.length;i++)
              if(this.clases[i].id == res[index].clase_id){
                for(let a=0;a<this.meses.length;a++){
                  if(today.getMonth()+1 == this.meses.length){
                    if(new Date(this.clases[i].fecha).getMonth() == a  && new Date(this.clases[i].fecha).getFullYear() ==  today.getFullYear()+1){
                      for(let q=0;q<this.mesesMostrar.length;q++){
                        if(this.meses[a] == this.mesesMostrar[q]){
                          this.mesesMostrar = this.mesesMostrar.slice(q+1,this.mesesMostrar.length);
                        }
                      }
                    }
                  }else{
                    if(new Date(this.clases[i].fecha).getMonth() == a  && new Date(this.clases[i].fecha).getFullYear() ==  today.getFullYear()){
                      for(let q=0;q<this.mesesMostrar.length;q++){
                        if(this.meses[a] == this.mesesMostrar[q]){
                          this.mesesMostrar.splice(q,1);
                        }
                      }
                    }
                  }

                }

              }
          }

        }

      })

    });

  }

  ngOnInit(): void {
    this._reservaService.getReserva(this.data.user.id).subscribe(res=>{
      this.misReservas=res
    });
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
    const modalRef = this.dialog.open(PasarelaComponent,{data:{apuntarse:array,precio:this.precio},disableClose: true});
      modalRef.afterClosed().subscribe((response) => {

        if (response) {
          this._alertaService.openAlert("Registrado correctamente");
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
              if(new Date(this.clases[a].fecha).getMonth() == mesesAinscribir[i] && this.clases[a].tipo==this.categoria){
                for(let index=0;index<this.misReservas.length;index++){
                  if(new Date(this.misReservas[index].fecha).getTime() == new Date(this.clases[a].fecha).getTime()){
                    this._reservaService.borrarReserva(this.misReservas[index].fecha).subscribe()
                  }
                }
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
