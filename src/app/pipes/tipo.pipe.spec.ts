import { TipoPipe } from './tipo.pipe';
import { UsuariosService } from '../services/usuarios/usuarios.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('TipoPipe', () => {
  it('create an instance', () => {
    let handler:HttpHandler;
    const http:HttpClient = new HttpClient(handler);
    const usuarioService:UsuariosService = new UsuariosService(http);
    const pipe = new TipoPipe(usuarioService);
    expect(pipe).toBeTruthy();
  });
});
