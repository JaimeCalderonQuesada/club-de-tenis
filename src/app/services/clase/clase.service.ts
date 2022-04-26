import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClaseService {

  private url:string = "http://localhost/club-de-tenis/api/";
  constructor(private http: HttpClient) { }
  
  getClases():Observable<any>{
    return this.http.get(this.url+"?clases=1");
  }
 
}
