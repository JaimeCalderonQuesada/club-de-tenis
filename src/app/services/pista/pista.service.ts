import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pista } from 'src/app/clases/pista';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PistaService {
  private url:string = environment.url;


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

