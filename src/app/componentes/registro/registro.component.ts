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
import { PistaComponent } from '../modales/pista/pista.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public payPalConfig: any;
  public showPaypalButtons: boolean;
  public verReservas:Boolean=false;
  public reservas:Reserva[] = [];
  public ver:Boolean = false;
  public usuario:User = new User();
  public usuarios:User[] =[];
  public options!: FormGroup;
  public fechaActual:Date;
  public user:User;
  public pistas:Pista[] =[];
  public correcto:Boolean=false;
  public page:number=1;
  public pagePistas:number=1;
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
  public buscar="";
  public nombrePista:string="";
  public filtrar:Reserva[]=[];
  public reservasTodas:Reserva[];

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
        document.title = "Reservar Pista";
        this._pistaService.getPistas().subscribe(res=>{
          this.pistas=res
          for(let i =0;i<this.pistas.length;i++){
            this.pistas[i].url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.pistas[i].imagen);
          }
          if(this.user.tipo==0){
            this._reservaService.getReservas().subscribe((res:Reserva[])=>{
              this.reservas = res;
              this._usuariosService.getUsuarios().subscribe(res=>{
                this.usuarios=res;
                if(this.reservas.length>0){
                  this.verReservas=true;
                    for(let i=0;i<this.reservas.length;i++){
                      for(let index=0;index<this.pistas.length;index++){
                        if(this.reservas[i].pista_id == this.pistas[index].id){
                          this.reservas[i].nombre = this.pistas[index].name;
                        }
                      }
                      for(let u=0;u<this.usuarios.length;u++){
                        if(this.reservas[i].usuario_id == this.usuarios[u].id){
                          this.reservas[i].usuario = this.usuarios[u].name;
                        }
                      }
                    };
                }
              })
              this.reservasTodas = this.reservas;
            });
          }
        });
      }else{
        document.title = "Registro";
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
          this._alertaService.openAlert('El DNI ol correo esta repetido!!');
        }else{
          this.options.reset();
          this.route.navigate(['/sesion']);
          this._alertaService.openAlert('Usuario creado correctamente');
        }
      }
    );
  }

  mostrarPassword(input:string){
    let p = document.getElementById(input);
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
    }else{
      this.ver = true;
    }


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
      if(res.length>0){
        for(let i=0;i<res.length;i++){
          if(res[i].pista_id == index){
            if(new Date(res[i].fecha) > new Date()){
              this.events.push({start:new Date(res[i].fecha),title:res[i].tipo,color: {
                primary: "#e3bc08",
                secondary: "#e3bc08"
              }
              });
            }

          }
        }

        this.ver = true;
        this.refresh.next();
      }else{
        this.ver = true;
      }

    },
    error=>{
      this.ver = true;
    }
    );
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
      this.reserva.usuario_id = this.user.id;
      this._reservaService.insertarReserva(this.reserva).subscribe(
         result => {
        // Handle result
        this.events.push({start:this.horaReserva,title:"RESERVADO",color: {
          primary: "#e3bc08",
          secondary: "#e3bc08"
        }});
        this.refresh.next();
        this._alertaService.openAlert("Reserva creada correctamente");
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
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._reservaService.borrarReserva(fecha).subscribe();
        this.reservas.splice(icontrol,1);
        if(this.reservas.length==0){
          this.verReservas=false;
        }
        this._alertaService.openAlert('Reserva eliminada correctamente');
        if(this.reservas.length==5){
          this.page = 1;
        }
      }
    });

  }
  abrirNuevaPista(){
    const modalRef = this.dialog.open(PistaComponent,{disableClose: true});
    modalRef.afterClosed().subscribe((response) => {

      if (response) {
        this._pistaService.getPistas().subscribe(res=>{
          this.pistas=res
          for(let i =0;i<this.pistas.length;i++){
            this.pistas[i].url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.pistas[i].imagen);
          }
        });

      }

    });
  }
  borrarPista(index:number,id:number){
    this._alertaService.openConfirmDialog()
    .afterClosed().subscribe(res=>{
      if(res){
        this._pistaService.borrarPista(id).subscribe();
        this.pistas.splice(index,1);
        this._alertaService.openAlert('Pista eliminada correctamente');
        if(this.pistas.length==5){
          this.pagePistas = 1;
        }
      }
    });

  }
  editarPista(pista:Pista){
    const modalRef = this.dialog.open(PistaComponent,{data:{pista:pista},disableClose: true});
    modalRef.afterClosed().subscribe((response) => {

      if (response) {
        this._pistaService.getPistas().subscribe(res=>{
          this.pistas=res
          for(let i =0;i<this.pistas.length;i++){
            this.pistas[i].url = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ this.pistas[i].imagen);
          }
        });

      }

    });
  }
  pageChanged(event1:any){
    this.page = event1;

  }
  pageChangedPistas(event:any){
    this.pagePistas = event;
  }
  clicarPista(nombre:string){
    if(this.nombrePista.length==0){
      this.nombrePista = nombre;
      for(let i=0;i<this.reservasTodas.length;i++){
        if(this.nombrePista == this.reservasTodas[i].nombre){
          this.filtrar.push(this.reservasTodas[i]);
        }
      }
      this.reservas = this.filtrar;
    }else if(this.nombrePista == nombre){
      this.filtrar = [];
      this.nombrePista="";
      this.reservas = this.reservasTodas;

    }else{
      this.filtrar = [];
      this.nombrePista=nombre;
      for(let i=0;i<this.reservasTodas.length;i++){
        if(this.nombrePista == this.reservasTodas[i].nombre){
          this.filtrar.push(this.reservasTodas[i]);
        }
      }
      this.reservas = this.filtrar;
    }
    this.page=1;
  }
}
