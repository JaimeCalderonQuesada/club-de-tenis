import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CalendarUtils } from 'angular-calendar';
import { Pista } from 'src/app/clases/pista';
import { AlertaService } from 'src/app/services/alerta/alerta.service';
import { ClaseService } from 'src/app/services/clase/clase.service';
import { PistaService } from 'src/app/services/pista/pista.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { Utils } from 'src/app/utils';
import { CambiarComponent } from '../cambiar/cambiar.component';

@Component({
  selector: 'app-pista',
  templateUrl: './pista.component.html',
  styleUrls: ['./pista.component.css']
})
export class PistaComponent implements OnInit {
  public nuevapista!: FormGroup;
  public files: File[] = [];
  public imgDetails:any[]=[];
  public pista:Pista=new Pista();
  public modificar:Boolean=false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<PistaComponent>,
    private _alertaService:AlertaService,
    public util:Utils,
    public dialog: MatDialog,
    protected utils: CalendarUtils,
    private fb: FormBuilder,
    private _pistaService:PistaService
    ) {
    if(data){
      this.modificar=true;
      this.nuevapista = this.fb.group({
        name: [this.data.pista.name,[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.']{10,})")]],
        descripcion:[this.data.pista.descripcion,[Validators.required,Validators.maxLength(100),Validators.minLength(10)]]
      });
      
    }else{
      this.nuevapista = this.fb.group({
        name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.']{10,})")]],
        descripcion:["",[Validators.required,Validators.maxLength(100),Validators.minLength(10)]],
        imagen:["",[Validators.required]]
      });
    }
    
   }

  ngOnInit(): void {
  }

  convertToBase64 = (file:File):Promise<string> => {
    return new Promise<string> ((resolve,reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result!.toString());
      reader.onerror = error => reject(error);
    })
  }
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    if (this.files && this.files[0]) {
      for(let i = 0; i < this.files.length; i++) {
        this.convertToBase64(this.files[0])
        .then((result: string) => {
            const base64String = result.replace('data:', '')
              .replace(/^.+,/, '');
              this.imgDetails.push({ name:this.files[i].name, content:base64String });
          });
      }
    }
    if(this.imgDetails.length>=0){
      this.nuevapista.get('imagen')?.setValue('hola');
    }

  }

  onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  onSubmitPista(){
    if(this.modificar){

      if(this.data.pista.name == this.nuevapista.get('name')?.value && this.data.pista.descripcion == this.nuevapista.get('descripcion')?.value && this.files.length==0){
        this._alertaService.openAlert('Los datos deben ser diferentes!!');
      }else{
        this.pista.name = this.nuevapista.get('name')?.value;
        this.pista.descripcion = this.nuevapista.get('descripcion')?.value;
        if(this.imgDetails.length==0){
          this.pista.imagen = "";
        }else{
          this.pista.imagen = this.imgDetails[0].content;
        }
        this._pistaService.modificarPista(this.pista,this.data.pista.id).subscribe(()=>{
          this._alertaService.openAlert('Pista modificada correctamente');
          this.dialogRef.close(true);
        });
      }
    }else{
      this.pista.name = this.nuevapista.get('name')?.value;
      this.pista.descripcion = this.nuevapista.get('descripcion')?.value;
      this.pista.imagen = this.imgDetails[0].content;
      this._pistaService.insertarPista(this.pista).subscribe(
        result=>{
          this.nuevapista.reset();
          this.files = [];
          this._alertaService.openAlert('Pista añadida correctamente');
          this.dialogRef.close(true);
        },
        error=>{
        }
      );
    }


    
  }
}
