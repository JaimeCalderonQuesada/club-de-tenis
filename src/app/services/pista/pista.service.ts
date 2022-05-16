import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pista } from 'src/app/clases/pista';

@Injectable({
  providedIn: 'root'
})
export class PistaService {
  private url:string = "http://localhost/club-de-tenis/api/";
  

  constructor(private http: HttpClient) { }

  insertarPista(pista:Pista): Observable<any>{
    return this.http.post(this.url+"?pista=1",pista);
  }

  getPistas():Observable<any>{
    return this.http.get(this.url+"?pistas=1");
  }
  borrarPista(id: any):Observable<any>{
    return this.http.delete(this.url+"?borrarPista="+id);
  }
  modificarPista(pista:Pista,id:number): Observable<any>{
    return this.http.put(this.url+"?actualizarPista="+id,pista);
  }
  
}

