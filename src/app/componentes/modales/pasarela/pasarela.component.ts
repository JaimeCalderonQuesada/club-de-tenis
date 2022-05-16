import { Component, Inject, OnInit } from '@angular/core';
import { ICreateOrderRequest } from "ngx-paypal";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-pasarela',
  templateUrl: './pasarela.component.html',
  styleUrls: ['./pasarela.component.css']
})
export class PasarelaComponent implements OnInit {
  public payPalConfig: any;
  public fecha:string;
  public inscripcion:Boolean=false;
  public apuntarse:Boolean=false;
  public reserva:Boolean=false;
  public meses:string="";
  constructor(public dialogRef: MatDialogRef<PasarelaComponent>, @Inject(MAT_DIALOG_DATA) public data:any) { }

  ngOnInit(): void {
    this.payPalConfig = {
      currency: "EUR",
      clientId: "AbxPN5ExJln2llGIyj5v8vPg-Q4pJOVpyo5FjFisU7hD75Z8ExQ1JYpT-y81oEsgSNiB3FDd7EjTWLbD",
      createOrder: (data:any) =>
        <ICreateOrderRequest>{
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "EUR",
                value: "9.99",
                breakdown: {
                  item_total: {
                    currency_code: "EUR",
                    value: "9.99"
                  }
                }
              },
              items: [
                {
                  name: "Enterprise Subscription",
                  quantity: "1",
                  category: "DIGITAL_GOODS",
                  unit_amount: {
                    currency_code: "EUR",
                    value: "9.99"
                  }
                }
              ]
            }
          ]
        },
      advanced: {
        commit: "true"
      },
      style: {
        label: "paypal",
        layout: "vertical"
      },
      onApprove: (data:any, actions:any) => {
        console.log(
          "onApprove - transaction was approved, but not authorized",
          data,
          actions
        );
        actions.order.get().then((details:any) => {
          console.log(
            "onApprove - you can get full order details inside onApprove: ",
            details
          );
          
        });
      },
      onClientAuthorization: (data:any) => {
        console.log(
          "onClientAuthorization - you should probably inform your server about completed transaction at this point",
          data
        );
        this.dialogRef.close(true);
      },
      onCancel: (data:any, actions:any) => {
        console.log("OnCancel", data, actions);
      },
      onError: (err:any) => {
        console.log("OnError", err);
      },
      onClick: (data:any, actions:any) => {
        console.log("onClick", data, actions);
      }
    };
    if(this.data == null){
      this.inscripcion=true;
    }else if(this.data.apuntarse){
      this.apuntarse = true;
      
      for (let index = 0; index < this.data.apuntarse.length; index++) {
        if(this.meses == ""){
          this.meses = this.data.apuntarse[index];
        }else{
          this.meses += ", "+this.data.apuntarse[index];
        }
        
      }
     
    } else{
      this.reserva = true;
      this.fecha =  ""+this.data.hora.getFullYear()+"-"+(this.data.hora.getMonth()+1)+"-"+this.data.hora.getDate()+" "+this.data.hora.getHours()+":"+this.data.hora.getMinutes()+0+":"+this.data.hora.getSeconds()+0+"";
    }
}
  
}
