import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reserva } from 'src/app/clases/reserva';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private url:string = environment.url;
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
  borrarReserva(fecha:string):Observable<any>{
    return this.http.delete(this.url+"?borrarReserva="+fecha);
  }
}
