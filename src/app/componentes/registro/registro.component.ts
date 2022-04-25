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

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  public payPalConfig: any;
  public showPaypalButtons: boolean;

  public ver:Boolean = false;
  public usuario:User = new User();
  public options!: FormGroup;
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
 
  constructor(public dialog: MatDialog,private _reservaService:ReservaService ,protected utils: CalendarUtils,private fb: FormBuilder,private _usuariosService:UsuariosService,private route:Router,private _pistaService:PistaService) {

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
    
    if(sessionStorage.length>0){
      this.user = JSON.parse(sessionStorage.getItem('user'))[0];
      
    }


    console.log(this.user)
    if(this.user){
      document.title = "Reservar Pista";
      this._pistaService.getPistas().subscribe(res=>this.pistas=res);

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

  errores(){
    if(this.options.get('name')?.hasError('pattern')){
      return 'Escriba un nombre y apellidos correcto.'
    }
    if(this.options.get('name')?.hasError('maxlength')){
      return 'El máximo son 100 caracteres.'
    }
    return this.options.get('name')?.hasError('required') ? 'Campo requerido' : '';
  }

  erroresEmail(){
    if(this.options.get('email')?.hasError('minlength')){
      return 'El email debe tener mínimo 10 caracteres.'
    }
    if(this.options.get('email')?.hasError('maxlength')){
      return 'El email debe tener máximo 100 caracteres.'
    }
    if(this.options.get('email')?.hasError('email')){
      return 'El email debe contener un @.'
    }
    return this.options.get('email')?.hasError('required') ? 'Campo requerido' : '';
  }

  erroresDni(){
    if(this.options.get('dni')?.hasError('pattern')){
      return 'El dni debe tener 8 numeros y una letra.'
    }
    return this.options.get('dni')?.hasError('required') ? 'Campo requerido' : '';
  }

  erroresMovil(){
    if(this.options.get('movil')?.hasError('pattern')){
      return 'El movil debe tener un formato correcto.'
    }
    return this.options.get('movil')?.hasError('required') ? 'Campo requerido' : '';
  }
  erroresFecha(){
    if(this.options.get('fecha')?.hasError('max')){
      return 'Debes tener más de 10 años.'
    }
    if(this.options.get('fecha')?.hasError('min')){
      return 'Debes tener menos de 100 años.'
    }
    return this.options.get('fecha')?.hasError('required') ? 'Campo requerido' : '';
  }
  erroresSexo(){
    return this.options.get('sexo')?.hasError('required') ? 'Campo requerido' : '';
  }
  erroresPassword(){
    if(this.options.get('password')?.hasError('maxlength')){
      return 'El password debe tener máximo 100 caracteres.'
    }
    if(this.options.get('password')?.hasError('pattern')){
      return 'El password debe tener un formato correcto.'
    }
    return this.options.get('password')?.hasError('required') ? 'Campo requerido' : '';
  }

  erroresPassword2(){
    if(this.options.get('password2')?.hasError('MustMatch')){
      return 'Las contraseñas no son iguales.'
    }
    return this.options.get('password2')?.hasError('required') ? 'Campo requerido' : '';
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
        }
      },
      error => {
        console.log(error)
      }
    );
  }

  abrirCalendario(index:number){
    console.log(index);
    this.idPista = index;

    if(this.viewDate.getMonth() == new Date().getMonth()){
      this.dis = true;
    }else{
      this.dis = false;
    }
    this._reservaService.getReservas().subscribe((res:any)=>{
      this.events = [];
      if(res.length>0){
        for(let i=0;i<res.length;i++){
          console.log(res[i].pista_id)
          if(res[i].pista_id == index){

            this.events.push({start:new Date(res[i].fecha),title:'RESERVADO',color: {
              primary: "#e3bc08",
              secondary: "#e3bc08"
            }
          });
          }

        }
        this.ver = true;
      }

    },
    error=>{
      this.ver = true;
    })

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
    console.log(new Date().getTime());
    console.log(date.getTime());
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
      console.log(ho)
      console.log(hora.getHours())
      if( ho == hora.getTime()){
        this.r = true;
        break;
      }
    }
    if(!this.r){
      const modalRef = this.dialog.open(PasarelaComponent);
      modalRef.afterClosed().subscribe((response) => {
  
        if (response) {
          this.crearReserva();
        }
  
      });
    }
  }
  crearReserva(){
    this.reserva.fecha = ""+this.horaReserva.getFullYear()+"-"+(this.horaReserva.getMonth()+1)+"-"+this.horaReserva.getDate()+" "+this.horaReserva.getHours()+":"+this.horaReserva.getMinutes()+0+":"+this.horaReserva.getSeconds()+0+"";
       this.reserva.pistaid = this.idPista;
       this.reserva.usuarioid = this.user.id;
       this._reservaService.insertarReserva(this.reserva).subscribe(
         result => {
        // Handle result
        console.log(result);
        this.events.push({start:this.horaReserva,title:'RESERVADO',color: {
          primary: "#e3bc08",
          secondary: "#e3bc08"
        }});
        this.refresh.next();
      },
      error => {
        console.log(error)
      })
  }
  
  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    console.log('beforeMonthViewRender is called');
    let da = new Date();
    da.setDate(new Date().getDate()-1)
    body.forEach( day => {
      if(day.date.getTime() < da.getTime()){
        day.cssClass = 'disabled';

      }

    });

  }
  beforeDayViewRender(body:CalendarWeekViewBeforeRenderEvent){
    console.log(body)
    if(body.header[0].day == 6){
      body.hourColumns[0].hours.splice(6,3);
    }
    if(body.header[0].day == 0){
      body.hourColumns[0].hours.splice(6,10);
    }
  }
}
