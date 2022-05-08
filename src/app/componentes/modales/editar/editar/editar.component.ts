import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/clases/user';
import { AlertaService } from 'src/app/services/alerta/alerta.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { Utils } from 'src/app/utils';
import { CambiarComponent } from '../../cambiar/cambiar.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
  public editar!: FormGroup;
  public usuario:User = new User();


  constructor(private _alertaService:AlertaService,public dialogRef: MatDialogRef<CambiarComponent>,private _usuariosService:UsuariosService,public utils:Utils,private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data:any) {
    this.editar = this.fb.group({
      name: [this.data.user.name,[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
      email: [this.data.user.email,[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
      movil:[this.data.user.movil,[Validators.required,Validators.pattern(/^[679]{1}[0-9]{8}$/)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmitEditar(){

    this.usuario.name = this.editar.get('name')?.value;
    this.usuario.email = this.editar.get('email')?.value;
    this.usuario.movil = this.editar.get('movil')?.value;
    if(this.data.user.name == this.usuario.name && this.data.user.email == this.usuario.email && this.data.user.movil == this.usuario.movil){
      this._alertaService.openAlert('Los datos deben ser diferentes!!');
    }else{
      this._usuariosService.modificarUser(this.usuario,this.data.user.id).subscribe(
        result => {
          // Handle result
          this._usuariosService.getUsuario(this.data.user.id).subscribe(
            (res:any)=>{
              document.cookie =  "user="+JSON.stringify(res[0]);
              this.data.user = res[0];
              this.dialogRef.close(true);
            }
          )
        }
      )
    }



  }
}
