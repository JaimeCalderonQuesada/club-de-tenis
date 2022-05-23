import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CalendarUtils } from 'angular-calendar';
import { Pista } from 'src/app/clases/pista';
import { Torneo } from 'src/app/clases/torneo';
import { AlertaService } from 'src/app/services/alerta/alerta.service';
import { ClaseService } from 'src/app/services/clase/clase.service';
import { PistaService } from 'src/app/services/pista/pista.service';
import { ReservaService } from 'src/app/services/reserva/reserva.service';
import { UsuariosService } from 'src/app/services/usuarios/usuarios.service';
import { Utils } from 'src/app/utils';
import { PistaComponent } from '../pista/pista.component';
import { TorneoService } from '../../../services/torneo/torneo.service';

@Component({
  selector: 'app-torneo',
  templateUrl: './torneo.component.html',
  styleUrls: ['./torneo.component.css']
})
export class TorneoComponent implements OnInit {

  public nuevapista!: FormGroup;
  public files: File[] = [];
  public imgDetails:any[]=[];
  public torneo:Torneo=new Torneo();
  public modificar:Boolean=false;
  public fechaActual:Date;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef: MatDialogRef<PistaComponent>,
    private _alertaService:AlertaService,
    public util:Utils,
    public dialog: MatDialog ,
    protected utils: CalendarUtils,
    private fb: FormBuilder,
    private _torneoService:TorneoService
    ) {
    this.fechaActual = new Date();
    if(data){
      this.modificar=true;
      this.nuevapista = this.fb.group({
        name: [this.data.torneo.name,[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.']{10,})")]],
        descripcion:[this.data.torneo.localidad,[Validators.required,Validators.maxLength(100),Validators.minLength(10)]],
        fecha:[this.data.torneo.fecha,[Validators.required]],
        fechaActual:[this.fechaActual]
      }, {validator: this.fechaMayor('fecha','fechaActual')});
      
    }else{
      this.nuevapista = this.fb.group({
        name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.']{10,})")]],
        descripcion:["",[Validators.required,Validators.maxLength(100),Validators.minLength(10)]],
        fecha:[,[Validators.required]],
        fechaActual:[this.fechaActual],
        imagen:["",[Validators.required]]
      }, {validator: this.fechaMayor('fecha','fechaActual')});
    }
    
   }

  ngOnInit(): void {
  }
  fechaMayor(from: string,to:string) {

    return(formGroup:FormGroup)=>{
      const control = formGroup.controls[from];
      const matchingcontrol = formGroup.controls[to];
      if(matchingcontrol.errors && !matchingcontrol.errors?.["MustMatch"]){
        return
      }
      
      if(new Date(control.value) <= matchingcontrol.value){
        control.setErrors({MustMatch:true});
      }else{
        control.setErrors(null)
      }
    }
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

      if(this.data.torneo.name == this.nuevapista.get('name')?.value && this.data.torneo.localidad == this.nuevapista.get('descripcion')?.value && this.data.torneo.fecha == this.nuevapista.get('fecha')?.value && this.files.length==0){
        this._alertaService.openAlert('Los datos deben ser diferentes!!');
      }else{
        this.torneo.name = this.nuevapista.get('name')?.value;
        this.torneo.localidad = this.nuevapista.get('descripcion')?.value;
        this.torneo.fecha = new Date(this.nuevapista.get('fecha')?.value);
        if(this.imgDetails.length==0){
          this.torneo.imagen = "";
        }else{
          this.torneo.imagen = this.imgDetails[0].content;
        }
        this._torneoService.modificarTorneo(this.torneo,this.data.torneo.id).subscribe(
          result=>{
            this._alertaService.openAlert('Torneo modificado correctamente');
            this.dialogRef.close(true);
          },
          error=>{
          console.log(error)
        });
      }
    }else{
      this.torneo.name = this.nuevapista.get('name')?.value;
      this.torneo.localidad = this.nuevapista.get('descripcion')?.value;
      this.torneo.imagen = this.imgDetails[0].content;
      this.torneo.fecha = new Date(this.nuevapista.get('fecha')?.value);
      this._torneoService.insertarTorneo(this.torneo).subscribe(
        result=>{
          this.nuevapista.reset();
          this.files = [];
          this._alertaService.openAlert('Torneo añadido correctamente');
          this.dialogRef.close(true);
        },
        error=>{
          this.files = [];
          this.imgDetails = [];
          this._alertaService.openAlert('Imagen demasiada grande');
        }
      );
    }


    
  }

}
