import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contacto } from 'src/app/clases/contacto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private url:string = environment.url;
  constructor(private http: HttpClient) { }
  insertarContacto(form:Contacto): Observable<any>{
    return this.http.post(this.url+"?contactos=1",form);
  }
  getContactos():Observable<any>{
    return this.http.get(this.url+"?contactosVer=1");
  }
  borrarContacto(id: any):Observable<any>{
    return this.http.delete(this.url+"?borrarContacto="+id);
  }
}

