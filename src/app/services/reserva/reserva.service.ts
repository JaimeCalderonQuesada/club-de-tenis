import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from 'src/app/clases/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private url:string = "http://localhost/club-de-tenis/api/";
  constructor(private http: HttpClient) { }
  insertarReserva(reserva:Reserva): Observable<any>{
    return this.http.post(this.url+"?reserva=1",reserva);
  }
  getReservas():Observable<any>{
    return this.http.get(this.url+"?reservas=1");
  }
  getReserva(id:number):Observable<any>{
    return this.http.get(this.url+"?reservasUsuario="+id);
  }
  borrarReserva(id: any):Observable<any>{
    return this.http.delete(this.url+"?borrarPista="+id);
  }
}
