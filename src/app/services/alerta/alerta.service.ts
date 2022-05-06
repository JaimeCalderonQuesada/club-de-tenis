import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../componentes/modales/confirmar/confirmar.component';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor(private _snackBar: MatSnackBar,private dialog:MatDialog) { }

  
  public openAlert(msg: string, time = 5000 as number) {


    this._snackBar.open(msg, 'X', {

      duration: time,

      panelClass: ['alerta']

    });

  }

  public openConfirmDialog(){
    return this.dialog.open(ConfirmarComponent,{
      disableClose:true
    })
  }

}
