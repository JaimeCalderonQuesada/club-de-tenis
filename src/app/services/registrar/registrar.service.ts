import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inscribir } from 'src/app/clases/inscribir';
import { environment } from 'src/environments/environment';
import { Registrar } from '../../clases/registrar';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {

  private url:string = environment.url;
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
  modificarRegistro(registrar:Registrar): Observable<any>{
    return this.http.put(this.url+"?actualizarRegistro=1",registrar);
  }
}
