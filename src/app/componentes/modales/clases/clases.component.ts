import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CambiarComponent } from '../cambiar/cambiar.component';
import { PasarelaComponent } from '../pasarela/pasarela.component';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  public precio:number;
  public edad:number;
  public categoria:string;
  public meses:Array<string>;
  public mesesMostrar:Array<string>;
  constructor(public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<CambiarComponent>) {
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
      this.categoria = "benjamin";
      this.precio = 35;
    }else if(this.edad === 11 || this.edad === 12){
      this.categoria = "alevin";
      this.precio = 38;
    }else if(this.edad > 12 && this.edad < 17){
      this.categoria = "infantil";
      this.precio = 40;
    }else if(this.edad > 16 && this.edad < 19){
      this.categoria = "junior";
      this.precio = 40;
    }else if(this.edad > 18){
      this.categoria = "adulto";
      this.precio = 45;
    }
  
  }

  ngOnInit(): void {
  }

  apuntarse(){
    let array = [];
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
         console.log("hola")
        }

      })
  }

}
