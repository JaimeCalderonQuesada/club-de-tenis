import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  
  constructor(private _alertaService:AlertaService,public utils:Utils,private fb: FormBuilder,private _servicioContacto:ContactoService) { 
    document.title = "Contacto";
    this.options = this.fb.group({
      name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
      mensaje: ["",[Validators.required,Validators.minLength(10),Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    if(sessionStorage.length>0){
      this.user = JSON.parse(sessionStorage.getItem('user'));
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
        this.options.reset();
        this._alertaService.openAlert("Mensaje enviado correctamente!!");
      }
    );
  }
  
  borrarContacto(id:number,index:number){
    this._servicioContacto.borrarContacto(id).subscribe();
    this.contactos.splice(index,1);
    if(this.contactos.length==0){
      this.verContactos=false;
    }
    this._alertaService.openAlert('Contacto eliminado correctamente');
  }
}
