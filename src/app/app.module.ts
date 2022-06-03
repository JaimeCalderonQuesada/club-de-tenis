import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './componentes/nav/nav.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HomeComponent } from './componentes/home/home.component';
import { ClubComponent } from './componentes/club/club.component';
import { TorneosComponent } from './componentes/torneos/torneos.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SociosComponent } from './componentes/socios/socios.component';
import { SesionComponent } from './componentes/sesion/sesion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxPayPalModule } from 'ngx-paypal';
import { PasarelaComponent } from './componentes/modales/pasarela/pasarela.component';
import { SharedmoduleModule } from './sharedmodule.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Utils } from './utils';
import { CambiarComponent } from './componentes/modales/cambiar/cambiar.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { EditarComponent } from './componentes/modales/editar/editar/editar.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { PistaComponent } from './componentes/modales/pista/pista.component';
import { TorneoComponent } from './componentes/modales/torneo/torneo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmarComponent } from './componentes/modales/confirmar/confirmar.component';
import { ClasesComponent } from './componentes/modales/clases/clases.component';
import { NombrePipe } from './pipes/nombre.pipe';
import { FechaPipe } from './pipes/fecha.pipe';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { TipoPipe } from './pipes/tipo.pipe';
import { MesesPipe } from './pipes/meses.pipe';
import { ModificarComponent } from './componentes/modales/modificar/modificar.component';
import { AsistirPipe } from './pipes/asistir.pipe';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    ClubComponent,
    TorneosComponent,
    RegistroComponent,
    SociosComponent,
    SesionComponent,
    PasarelaComponent,
    CambiarComponent,
    EditarComponent,
    ContactoComponent,
    PistaComponent,
    TorneoComponent,
    ConfirmarComponent,
    ClasesComponent,
    NombrePipe,
    FechaPipe,
    SpinnerComponent,
    TipoPipe,
    MesesPipe,
    ModificarComponent,
    AsistirPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide:DateAdapter,
      useFactory:adapterFactory,
    }),
    NgxPayPalModule,
    SharedmoduleModule,
    BrowserAnimationsModule,
    NgxDropzoneModule,
    NgxPaginationModule
  ],
  exports:[

  ],
  providers: [Utils,{provide: HTTP_INTERCEPTORS, useClass:SpinnerInterceptor,multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
