import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor(private _snackBar: MatSnackBar) { }

  
  public openAlert(msg: string, time = 5000 as number) {


    this._snackBar.open(msg, 'X', {

      duration: time,

      panelClass: ['alerta']

    });

  }

}
