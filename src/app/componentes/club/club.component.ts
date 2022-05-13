import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/clases/user';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  public user:User;
  constructor() {document.title = "Club"; }

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
        valor = micookie.substring(igual+1);}
    }

    if(valor){
        this.user = JSON.parse(valor);
        
    }else{
        this.user = JSON.parse(sessionStorage.getItem("user"));
        
    }
  }

}
