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
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxPayPalModule } from 'ngx-paypal';
import { PasarelaComponent } from './componentes/modales/pasarela/pasarela.component';
import { SharedmoduleModule } from './sharedmodule.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Utils } from './utils';
import { CambiarComponent } from './componentes/modales/cambiar/cambiar.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

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
    CambiarComponent
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
    NgxDropzoneModule
  ],
  exports:[

  ],
  providers: [Utils],
  bootstrap: [AppComponent]
})
export class AppModule { }
