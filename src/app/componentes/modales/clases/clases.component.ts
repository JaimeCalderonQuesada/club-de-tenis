import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CambiarComponent } from '../cambiar/cambiar.component';

@Component({
  selector: 'app-clases',
  templateUrl: './clases.component.html',
  styleUrls: ['./clases.component.css']
})
export class ClasesComponent implements OnInit {
  public edad:number;
  public categoria:string;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,public dialogRef: MatDialogRef<CambiarComponent>) {
    const today:Date = new Date();
    const cumple:Date = new Date(data.user.fecha);
    this.edad =today.getFullYear() - cumple.getFullYear();
    const mes:number = today.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && today.getDate() < cumple.getDate())) {
      this.edad--;
    }
    if(this.edad > 0 && this.edad <= 10){
      this.categoria = "benjamin";
    }else if(this.edad === 11 || this.edad === 12){
      this.categoria = "alevin";
    }else if(this.edad > 12 && this.edad < 17){
      this.categoria = "infantil";
    }else if(this.edad > 16 && this.edad < 19){
      this.categoria = "junior";
    }else if(this.edad > 18){
      this.categoria = "adulto";
    }
   
  }

  ngOnInit(): void {
  }

}
