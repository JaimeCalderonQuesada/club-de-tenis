import { NgModule, Pipe } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClubComponent } from './componentes/club/club.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { HomeComponent } from './componentes/home/home.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { SesionComponent } from './componentes/sesion/sesion.component';
import { SociosComponent } from './componentes/socios/socios.component';
import { TorneosComponent } from './componentes/torneos/torneos.component';
import { NombrePipe } from './pipes/nombre.pipe';

const routes: Routes = [
  { path: '', pathMatch:'full', redirectTo:'home'},
  { path: 'home', component: HomeComponent},
  { path: 'club', component: ClubComponent},
  { path: 'torneos', component: TorneosComponent},
  { path: 'registro', component: RegistroComponent},
  { path: 'clases', component: SociosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'sesion', component: SesionComponent},
  { path: '**', pathMatch:'full', redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
