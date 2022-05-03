import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { User } from 'src/app/clases/user';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { Router } from '@angular/router';
import { PistaService } from '../../services/pista/pista.service';
import { Pista } from 'src/app/clases/pista';
import { CalendarView,CalendarEvent, CalendarUtils, CalendarMonthViewDay, CalendarWeekViewBeforeRenderEvent  } from 'angular-calendar';
import { Subject } from 'rxjs';
import { Reserva } from '../../clases/reserva';
import { ReservaService } from '../../services/reserva/reserva.service';
import { PasarelaComponent } from '../modales/pasarela/pasarela.component';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { Utils } from 'src/app/utils';
import { ClaseService } from 'src/app/services/clase/clase.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertaService } from 'src/app/services/alerta/alerta.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public payPalConfig: any;
  public showPaypalButtons: boolean;
  public verReservas:Boolean=false;
  public reservas:Reserva[];
  public ver:Boolean = false;
  public usuario:User = new User();
  public options!: FormGroup;
  public nuevapista!: FormGroup;
  public fechaActual:Date;
  public user:User;
  public pistas:Pista[];
  public correcto:Boolean=false;

  public disable:Boolean=false;
  public dis:Boolean=false;
  public refresh: Subject<void> = new Subject<void>();
  public viewDate: Date = new Date();
  public view: CalendarView = CalendarView.Month;
  public CalendarView = CalendarView;
  public eventSnapSize:number=1;
  public events: CalendarEvent[] = [];
  public r!:boolean;
  public reserva:Reserva=new Reserva();
  public idPista:number;
  public dayTypesStored: any;
  public horaReserva:Date;
  public files: File[] = [];
  public imgDetails:any[]=[];
  public pista:Pista=new Pista();

  constructor(private _alertaService:AlertaService,private _sanitizer: DomSanitizer,public util:Utils,public dialog: MatDialog,private _reservaService:ReservaService,private _claseService:ClaseService ,protected utils: CalendarUtils,private fb: FormBuilder,private _usuariosService:UsuariosService,private route:Router,private _pistaService:PistaService) {

    this.fechaActual = new Date();

    this.options = this.fb.group({
      name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s[a-zA-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,}'?-?[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,}\\s?([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,})?)")]],
      password:["",[Validators.required,Validators.maxLength(100),Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/)]],
      email: ["",[Validators.required,Validators.email,Validators.minLength(10),Validators.maxLength(100)]],
      sexo: ["",[Validators.required]],
      movil:["",[Validators.required,Validators.pattern(/^[679]{1}[0-9]{8}$/)]],
      dni:["",[Validators.required,Validators.pattern(/^(\d{8})([A-Z])$/)]],
      fecha:[,[Validators.required,Validators.max(this.fechaActual.getFullYear()-10),Validators.min(this.fechaActual.getFullYear()-100)]],
      password2:["",[Validators.required]]
    },{
      validators:this.MustMatch('password','password2')
    });

    this.nuevapista = this.fb.group({
      name: ["",[Validators.required,Validators.maxLength(100),Validators.pattern("^([a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.']{10,})")]],
      descripcion:["",[Validators.required,Validators.maxLength(100),Validators.minLength(10)]],
      imagen:["",[Validators.required]]
    });
  }

  ngOnInit(): void {
    
    if(sessionStorage.length>0){
      this.user = JSON.parse(sessionStorage.getItem('user'));
      if(this.user){

        this._pistaService.getPistas().subscribe(res=>{
          this.pistas=res
          console.log(res)
          for(let i =0;i<this.pistas.length;i++){
            this.pistas[i].url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.pistas[i].imagen);
          }
        });
      document.title = "Reservar Pista";
    }else{
      document.title = "Registro";
    }

    if(this.user.tipo==0){
      this._reservaService.getReservas().subscribe((res:Reserva[])=>{
        this.reservas = res;
        if(this.reservas.length>0){
          this._pistaService.getPistas().subscribe(resp=>{
            this.pistas=resp;
            for(let i=0;i<this.reservas.length;i++){
              for(let index=0;index<this.pistas.length;index++){
                if(this.reservas[i].pista_id == this.pistas[index].id){
                  this.reservas[i].nombre = this.pistas[index].name;
                }
              }
            };
            this.verReservas=true;
          });
        }
      });
    }
    }
    

  }
  pay() {
    this.showPaypalButtons = true;
  }
  MustMatch(controlName:string,matchingControlName:string) {
    return(formGroup:FormGroup)=>{
      const control = formGroup.controls[controlName];
      const matchingcontrol = formGroup.controls[matchingControlName];
      if(matchingcontrol.errors && !matchingcontrol.errors?.["MustMatch"]){
        return
      }
      if(control.value !== matchingcontrol.value){
        matchingcontrol.setErrors({MustMatch:true});
      }else{
        matchingcontrol.setErrors(null)
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
    this.pista.name = this.nuevapista.get('name')?.value;
    this.pista.descripcion = this.nuevapista.get('descripcion')?.value;
    this.pista.imagen = this.imgDetails[0].content;
    this._pistaService.insertarPista(this.pista).subscribe(
      result=>{
        this.nuevapista.reset();
        this.files = [];
        this._alertaService.openAlert('Pista añadida correctamente');
      }
    );
  }


  onSubmit(){
    
    this.usuario.tipo = 1;
    this.usuario.name = this.options.get('name')?.value;
    this.usuario.password = this.options.get('password')?.value;
    this.usuario.email = this.options.get('email')?.value;
    this.usuario.sexo = this.options.get('sexo')?.value;
    this.usuario.movil = this.options.get('movil')?.value;
    this.usuario.dni = this.options.get('dni')?.value;
    this.usuario.fecha = new Date(this.options.get('fecha')?.value);
    this._usuariosService.insertarUser(this.usuario).subscribe(
      result => {
        // Handle result
        if(result === 1062){
          this.correcto = true;
        }else{
          this.options.reset();
          this.route.navigate(['/sesion']);
          this._alertaService.openAlert('Usuario creado correctamente');
        }
      }
    );
  }

  mostrarPassword(){
    let p = document.getElementById("mostrar");
    if (p.attributes[2].value === "password") {
      p.attributes[2].value = "text";
    } else {
      p.attributes[2].value = "password";
    }
  }

  abrirCalendario(index:number){
    this.idPista = index;

    if(this.viewDate.getMonth() == new Date().getMonth()){
      this.dis = true;
    }else{
      this.dis = false;
    }
    this.addReservas(index);
    if(index==1){
      this.addClases(index);
    }
    this.ver = true;

  }

  addReservas(index:number){
    this._reservaService.getReservas().subscribe((res:any)=>{
      this.events = [];
      if(res.length>0){
        for(let i=0;i<res.length;i++){
          if(res[i].pista_id == index){

            if(new Date(res[i].fecha) < new Date()){

            }else{
              this.events.push({start:new Date(res[i].fecha),title:"RESERVADO",color: {
                primary: "#e3bc08",
                secondary: "#e3bc08"
              }
              });
            }

          }

        }

      }

    });
  }


  addClases(index:number){
    this._claseService.getClases().subscribe((res:any)=>{
      this.events = [];
      if(res.length>0){
        for(let i=0;i<res.length;i++){
          if(res[i].pista_id == index){

            if(new Date(res[i].fecha) < new Date()){

            }else{
              this.events.push({start:new Date(res[i].fecha),title:res[i].tipo,color: {
                primary: "#e3bc08",
                secondary: "#e3bc08"
              }
              });
            }

          }

        }

      }

    });
  }

  mesSiguiente(){
    if(this.viewDate.getMonth() == new Date().getMonth()){
      this.dis = true;
    }else{
      this.dis = false;
    }
  }
  mesAnterior(){
    if(this.viewDate.getMonth() == new Date().getMonth()){
      this.dis = true;
    }else{
      this.dis = false;
    }
  }
  diaSiguiente(){
    if(this.viewDate < new Date()){
      this.disable = true;
    }else{
      this.disable = false;
    }
  }
  diaAnterior(){
    if(this.viewDate < new Date()){
      this.disable = true;
    }else{
      this.disable = false;
    }
  }
  voler(){
    this.ver = false;
    this.viewDate = new Date();
  }
  setView(view: CalendarView) {
    this.view = view;
    if(this.viewDate.getMonth() == new Date().getMonth()){
      this.dis = true;
    }else{
      this.dis = false;
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    let day = new Date();
    day.setDate(new Date().getDate()-1)
    //this.events.push({start:date,title:'new event'});
    if(date.getTime() < day.getTime()){

    }else{
      this.viewDate = date;
      this.setView(CalendarView.Day);
    }
    if(this.viewDate < new Date()){
      this.disable = true;
    }else{
      this.disable = false;
    }
  }


  horaClicked(hora:Date){
    

    this.r = false;
    this.horaReserva=hora;
    for (let index = 0; index < this.events.length; index++) {
      let ho = this.events[index].start.getTime();
      if(ho == hora.getTime() ){
        this.r = true;
        break;
      }
    }
    if( hora.getDate() === new Date().getDate() ){
      this.r = true;
      
    }
    if(!this.r){
      const modalRef = this.dialog.open(PasarelaComponent,{data:{hora:hora},disableClose: true});
      modalRef.afterClosed().subscribe((response) => {

        if (response) {
          this.crearReserva();
        }

      });
    }
  }
  crearReserva(){
      this.reserva.fecha = ""+this.horaReserva.getFullYear()+"-"+(this.horaReserva.getMonth()+1)+"-"+this.horaReserva.getDate()+" "+this.horaReserva.getHours()+":"+this.horaReserva.getMinutes()+0+":"+this.horaReserva.getSeconds()+0+"";
      this.reserva.pista_id = this.idPista;
      this.reserva.usuarioid = this.user.id;
      this._reservaService.insertarReserva(this.reserva).subscribe(
         result => {
        // Handle result
        this.events.push({start:this.horaReserva,title:"RESERVADO",color: {
          primary: "#e3bc08",
          secondary: "#e3bc08"
        }});
        this.refresh.next();
      })
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {

    let da = new Date();
    da.setDate(new Date().getDate()-1)
    body.forEach( day => {
      if(day.date.getTime() < da.getTime()){
        day.cssClass = 'disabled-day';
      }else{

      }

    });
  }
  beforeDayViewRender(body:CalendarWeekViewBeforeRenderEvent){
    
    if(body.header[0].day == 6){
      console.log(body.hourColumns[0].hours[6].segments[0])
      body.hourColumns[0].hours[6].segments[0].date = new Date();
      body.hourColumns[0].hours[7].segments[0].date = new Date();
      body.hourColumns[0].hours[8].segments[0].date = new Date();

      body.hourColumns[0].hours[6].segments[0].cssClass = 'disabled';
      body.hourColumns[0].hours[7].segments[0].cssClass = 'disabled';
      body.hourColumns[0].hours[8].segments[0].cssClass = 'disabled';
    }else if(body.header[0].day == 0){
      body.hourColumns[0].hours.splice(6,10);
    }
  }
  borrarReserva(icontrol:number,fecha:string){
    this._reservaService.borrarReserva(fecha).subscribe();
    this.reservas.splice(icontrol,1);
    if(this.reservas.length==0){
      this.verReservas=false;
    }
    this._alertaService.openAlert('Reserva eliminada correctamente');
  }
}
