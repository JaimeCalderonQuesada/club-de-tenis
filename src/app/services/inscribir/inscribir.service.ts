import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscribir } from '../../clases/inscribir';

@Injectable({
  providedIn: 'root'
})
export class InscribirService {
  private url:string = "http://localhost/club-de-tenis/api/";
  constructor(private http: HttpClient) { }

  insertarInscripcion(inscripcion:Inscribir): Observable<any>{
    return this.http.post(this.url+"?inscribir=1",inscripcion);
  }
  getInscripciones():Observable<any>{
    return this.http.get(this.url+"?inscripciones=1");
  }
  getInscripcion(id:number):Observable<any>{
    return this.http.get(this.url+"?inscripcionesUsuario="+id);
  }
  borrarInscripcion(inscripcion:Inscribir):Observable<any>{
    return this.http.post(this.url+"?borrarInscripcion=1",inscripcion);
  }
}
