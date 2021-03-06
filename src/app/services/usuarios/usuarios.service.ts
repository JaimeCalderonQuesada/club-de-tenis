import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, Subject, throwError } from 'rxjs';
import { User } from 'src/app/clases/user';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url:string = environment.url;
  public existe:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  public verDatos:BehaviorSubject<boolean>= new BehaviorSubject<boolean>(true);
  public page:BehaviorSubject<number>= new BehaviorSubject<number>(1);
  constructor(private http: HttpClient) {

  }

  insertarUser(user:User): Observable<any>{
    return this.http.post(this.url+"?insertar=1",user);
  }
  login(email:any, contrasenia:any):Observable<any>{
    return this.http.get(this.url+"?login="+email+"&contrasenia="+contrasenia).pipe(
      catchError((resp: HttpErrorResponse)=>
        throwError(`Error al acceder, ${resp.message}`))
    );
  }

  modificarUser(user:User,id:number): Observable<any>{
    return this.http.put(this.url+"?actualizarUsuario="+id,user);
  }
  modificarCon(user:User,id:number): Observable<any>{
    return this.http.put(this.url+"?actualizarCon="+id,user);
  }
  getUsuarios():Observable<any>{
    return this.http.get(this.url);
  }

  getUsuario(id:number):Observable<any>{
    return this.http.get(this.url+"?usuario="+id);
  }

  getUsuarioCon(id:number):Observable<any>{
    return this.http.get(this.url+"?usuarioCon="+id);
  }
  borrarUsuario(id: any):Observable<any>{
    return this.http.delete(this.url+"?borrarUsuario="+id);
  }
}
