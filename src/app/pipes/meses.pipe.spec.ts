import { HttpHandler, HttpClient } from '@angular/common/http';
import { UsuariosService } from '../services/usuarios/usuarios.service';
import { MesesPipe } from './meses.pipe';

describe('MesesPipe', () => {
  it('create an instance', () => {
    let handler:HttpHandler;
    const http:HttpClient = new HttpClient(handler);
    const usuarioService:UsuariosService = new UsuariosService(http);
    const pipe = new MesesPipe(usuarioService);
    expect(pipe).toBeTruthy();
  });
});
