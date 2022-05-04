import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Torneo } from '../../clases/torneo';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  private url:string = "http://localhost/club-de-tenis/api/";
  constructor(private http: HttpClient) { }
  insertarTorneo(torneo:Torneo): Observable<any>{
    return this.http.post(this.url+"?torneo=1",torneo);
  }

  getTorneos():Observable<any>{
    return this.http.get(this.url+"?torneos=1");
  }
  borrarTorneo(id: any):Observable<any>{
    return this.http.delete(this.url+"?borrarTorneo="+id);
  }
  modificarTorneo(torneo:Torneo,id:number): Observable<any>{
    return this.http.put(this.url+"?actualizarTorneo="+id,torneo);
  }
}
