import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private _spinnerService:SpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._spinnerService.isLoading$.subscribe((res)=>{
      console.log(res)
    })
    this._spinnerService.show();
    this._spinnerService.isLoading$.subscribe((res)=>{
      console.log(res)
    })
    
    return next.handle(request).pipe(
      finalize(()=>{
        this._spinnerService.hide()
      })
    );
    
  }
}
