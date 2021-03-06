import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/utils';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { User } from '../../../clases/user';

@Component({
  selector: 'app-cambiar',
  templateUrl: './cambiar.component.html',
  styleUrls: ['./cambiar.component.css']
})
export class CambiarComponent implements OnInit {
  public options!: FormGroup;
  public usuario:User=new User();
  public anterior:string;
  public sesion:Boolean=false;
  constructor(
    public dialogRef: MatDialogRef<CambiarComponent>,
    private _usuariosService:UsuariosService,
    public util:Utils,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any
    ) {}

  ngOnInit(): void {
    let busca;
    let micookie;
    let valor;
    let listaCookies = document.cookie.split(";");
    for (let i in listaCookies) {
      busca = listaCookies[i].search("con");
      if (busca > -1) {micookie=listaCookies[i]
        valor = micookie.substring(6,micookie.length-1);
      }
    }
    if(valor){
      this.anterior = valor;
    }else{
      this.anterior = sessionStorage.getItem("con").substring(1,sessionStorage.getItem("con").length-1);
      this.sesion=true;
    }
  this.options = this.fb.group({
  antigua:[this.anterior],
  password:["",[Validators.required,Validators.maxLength(100),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/)]],
  password2:["",[Validators.required]]
  },{
    validators:this.MustMatch('antigua','password2','password')
  });

  }
  MustMatch(controlName:string,matchingControlName:string,matchingControlName2:string) {
    return(formGroup:FormGroup)=>{
      const control = formGroup.controls[controlName];
      const matchingcontrol = formGroup.controls[matchingControlName];
      const matchingcontrol2 = formGroup.controls[matchingControlName2];
      if(matchingcontrol.errors && !matchingcontrol.errors?.["MustMatch"] && matchingcontrol2.errors && !matchingcontrol2.errors?.["MustMatch"]){
        return
      }
      if(control.value !== matchingcontrol.value){
        matchingcontrol.setErrors({MustMatch:true});
      }else{
        matchingcontrol.setErrors(null)
      }

      if(control.value == matchingcontrol2.value){
        matchingcontrol2.setErrors({MustMatch:true});
      }
    }
  }
  onSubmit(){
    this.usuario.password = this.options.get('password')?.value;


    this._usuariosService.modificarCon(this.usuario,this.data.user.id).subscribe(
      result => {
        // Handle result

        this._usuariosService.getUsuario(this.data.user.id).subscribe(
          (res:any)=>{
            if(this.sesion){
              sessionStorage.setItem("user",JSON.stringify(res[0]));
              sessionStorage.setItem("con",JSON.stringify(this.usuario.password));
            }else{
              document.cookie =  "con="+JSON.stringify(this.usuario.password);
              document.cookie =  "user="+JSON.stringify(res[0]);
            }
            this.dialogRef.close(true);
          }
        )
      }
    )
  }
  mostrarPassword(input:string){
    let p = document.getElementById(input);
    if (p.attributes[2].value === "password") {
      p.attributes[2].value = "text";
    } else {
      p.attributes[2].value = "password";
    }
  }
}
