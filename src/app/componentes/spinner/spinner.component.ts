import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';

@Component({
  selector: 'app-spinner',
  template: `<div class="overlay" *ngIf="isLoading$ | async">
  <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
</div>`,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent  {
  isLoading$ = this._spinnerService.isLoading$;
  constructor(private _spinnerService:SpinnerService) { }
  
}
