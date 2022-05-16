import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscribir } from 'src/app/clases/inscribir';
import { Registrar } from '../../clases/registrar';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  private url:string = "http://localhost/club-de-tenis/api/";
  constructor(private http: HttpClient) { }

  insertarRegistro(registrar:Registrar): Observable<any>{
    return this.http.post(this.url+"?registrar=1",registrar);
  }
  getRegistros():Observable<any>{
    return this.http.get(this.url+"?registrados=1");
  }
  getRegistro(id:number):Observable<any>{
    return this.http.get(this.url+"?registrosUsuario="+id);
  }
  borrarRegistro(registrar:Registrar):Observable<any>{
    return this.http.post(this.url+"?borrarRegistro=1",registrar);
  }
}
