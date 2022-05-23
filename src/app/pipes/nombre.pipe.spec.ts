import { HttpHandler, HttpClient } from '@angular/common/http';
import { UsuariosService } from '../services/usuarios/usuarios.service';
import { NombrePipe } from './nombre.pipe';

describe('NombrePipe', () => {
  it('create an instance', () => {
    let handler:HttpHandler;
    const http:HttpClient = new HttpClient(handler);
    const usuarioService:UsuariosService = new UsuariosService(http);
    const pipe = new NombrePipe(usuarioService);
    expect(pipe).toBeTruthy();
  });
});
