import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, RequiredValidator } from '@angular/forms';
import { Contacto } from 'src/app/clases/contacto';
import { User } from 'src/app/clases/user';
import { AlertaService } from 'src/app/services/alerta/alerta.service';
import { ContactoService } from 'src/app/services/contacto/contacto.service';
import { Utils } from 'src/app/utils';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  public mostrar:Boolean=false;
  public options!: FormGroup;
  public contacto:Contacto = new Contacto();
  public user:User;
  public verContactos:Boolean=false;
  public contactos:Contacto[];
  public page:number;
  public buscar:string="";

  constructor(private http: HttpClient,private _alertaService:AlertaService,public utils:Utils,private fb: FormBuilder,private _servicioContacto:ContactoService) {
    document.title = "Contacto";
    this.options = this.fb.group({
      name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
      mensaje: ["",[Validators.required,Validators.minLength(10),Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
          let busca;
          let micookie;
          let igual;
          let valor;
          let listaCookies = document.cookie.split(";");
          for (let i in listaCookies) {
            busca = listaCookies[i].search("user");
            if (busca > -1) {micookie=listaCookies[i]
              igual = micookie.indexOf("=");
              valor = micookie.substring(igual+1);}
          }
          if(valor){
            this.user = JSON.parse(valor);
          }else{
            this.user = JSON.parse(sessionStorage.getItem("user"));
          }
    if(this.user){
      this.options.get('name')?.setValue(this.user.name);
      this.options.get('email')?.setValue(this.user.email);
      this.options.get('name')?.disable();
      this.options.get('email')?.disable();
      if(this.user.tipo==0){
        this.mostrar = true;
        this._servicioContacto.getContactos().subscribe((res:Contacto[])=>{
          this.contactos = res;
          if(this.contactos.length>0){
            this.verContactos=true;
          }
        });
      }
    }

  }

  onSubmit(){
    let busca;
    let micookie;
    let valor;
    let listaCookies = document.cookie.split(";");
    for (let i in listaCookies) {
      busca = listaCookies[i].search("contacto");
      if (busca > -1) {micookie=listaCookies[i]
        valor = micookie.substring(10,micookie.length-1);
      }
    }
    if(valor){
      console.log(valor)
      console.log(this.options.get('email')?.value)
      if(valor == this.options.get('email')?.value){
        this.options.get('mensaje')?.reset();
        this._alertaService.openAlert("Hoy ya has enviado un mensaje");
      }else{
        let expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
    document.cookie =  "contacto="+JSON.stringify(this.options.get('email')?.value)+";expires="+expires;
    this.contacto.name = this.options.get('name')?.value;
    this.contacto.email = this.options.get('email')?.value;
    this.contacto.mensaje = this.options.get('mensaje')?.value;

    this._servicioContacto.insertarContacto(this.contacto).subscribe(
      result => {
        // Handle result
        console.log(result)

      },
      error => {
        console.log(error)
      },
      () => {
        this.options.get('mensaje')?.reset();
        this._alertaService.openAlert("Mensaje enviado correctamente!!");
      }
    );
      }
    }else{

    this.contacto.name = this.options.get('name')?.value;
    this.contacto.email = this.options.get('email')?.value;
    this.contacto.mensaje = this.options.get('mensaje')?.value;
    this._servicioContacto.insertarContacto(this.contacto).subscribe(
      result => {
        // Handle result
        console.log(result)
      },
      error => {
        console.log(error)
      },
      () => {
        let expires = (new Date(Date.now()+ 86400*1000)).toUTCString();
        document.cookie =  "contacto="+JSON.stringify(this.options.get('email')?.value)+";expires="+expires;
        this.options.get('mensaje')?.reset();
        this._alertaService.openAlert("Mensaje enviado correctamente!!");
      }
    );
    }

  }

  borrarContacto(id:number,index:number){
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._servicioContacto.borrarContacto(id).subscribe();
        this.contactos.splice(index,1);
        if(this.contactos.length==0){
          this.verContactos=false;
        }
        this._alertaService.openAlert('Contacto eliminado correctamente');
        this.page=1;
      }
    });

  }
  pageChanged(event:any){
    this.page = event;
  }

}
