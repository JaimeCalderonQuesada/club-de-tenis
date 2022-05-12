import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/clases/user';
import { ClasesComponent } from '../modales/clases/clases.component';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {
  public user:User;
  public edad:number;
  constructor(public dialog: MatDialog) {document.title = "Clases"; }

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
  }

  abrirApuntarse(){
    
    
    const modalRef = this.dialog.open(ClasesComponent,{data:{user:this.user},disableClose: true});
    modalRef.afterClosed().subscribe((response) => {

      if (response) {
        
      }

    });
  }


}
