import { HttpClient, HttpHandler } from '@angular/common/http';
import { UsuariosService } from '../services/usuarios/usuarios.service';
import { AsistirPipe } from './asistir.pipe';

describe('AsistirPipe', () => {
  it('create an instance', () => {
    let handler:HttpHandler;
    const http:HttpClient = new HttpClient(handler);
    const usuarioService:UsuariosService = new UsuariosService(http);
    const pipe = new AsistirPipe(usuarioService);
    expect(pipe).toBeTruthy();
  });
});
