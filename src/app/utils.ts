import { FormGroup } from '@angular/forms';
export class Utils{
    errores(options:FormGroup){
        if(options.get('name')?.hasError('pattern')){
          return 'Escriba un nombre y apellidos correcto.'
        }
        if(options.get('name')?.hasError('maxlength')){
          return 'El máximo son 100 caracteres.'
        }
        return options.get('name')?.hasError('required') ? 'Campo requerido' : '';
      }
      erroresEmail(options:FormGroup){
        if(options.get('email')?.hasError('minlength')){
          return 'El email debe tener mínimo 10 caracteres.'
        }
        if(options.get('email')?.hasError('maxlength')){
          return 'El email debe tener máximo 100 caracteres.'
        }
        if(options.get('email')?.hasError('email')){
          return 'El email debe contener un @.'
        }
        return options.get('email')?.hasError('required') ? 'Campo requerido' : '';
      }
    
      erroresMensaje(options:FormGroup){
        if(options.get('mensaje')?.hasError('minlength')){
          return 'El mensaje debe tener mínimo 10 caracteres.'
        }
        if(options.get('mensaje')?.hasError('maxlength')){
          return 'El mensaje debe tener máximo 255 caracteres.'
        }
        return options.get('mensaje')?.hasError('required') ? 'Campo requerido' : '';
      }

      erroresDescripcion(options:FormGroup){
        if(options.get('descripcion')?.hasError('minlength')){
          return 'La descripción debe tener mínimo 10 caracteres.'
        }
        if(options.get('descripcion')?.hasError('maxlength')){
          return 'La descripción debe tener máximo 255 caracteres.'
        }
        return options.get('descripcion')?.hasError('required') ? 'Campo requerido' : '';
      }

      erroresEmailLogin(options:FormGroup){
        if(options.get('email')?.hasError('minlength')){
          return 'El email debe tener mínimo 10 caracteres.'
        }
        if(options.get('email')?.hasError('maxlength')){
          return 'El email debe tener máximo 100 caracteres.'
        }
        if(options.get('email')?.hasError('email')){
          return 'El email debe contener un @.'
        }
        return options.get('email')?.hasError('required') ? 'Campo requerido' : '';
      }
    
      erroresPassword(options:FormGroup){
        if(options.get('password')?.hasError('maxlength')){
          return 'El password debe tener máximo 100 caracteres.'
        }
        if(options.get('password')?.hasError('pattern')){
          return 'El password debe tener un formato correcto.'
        }
        if(options.get('password')?.hasError('MustMatch')){
          return 'La contraseña debe ser diferente a la antigua.'
        }
        return options.get('password')?.hasError('required') ? 'Campo requerido' : '';
      }
    
    
      erroresDni(options:FormGroup){
        if(options.get('dni')?.hasError('pattern')){
          return 'El dni debe tener 8 numeros y una letra.'
        }
        return options.get('dni')?.hasError('required') ? 'Campo requerido' : '';
      }
    
      erroresMovil(options:FormGroup){
        if(options.get('movil')?.hasError('pattern')){
          return 'El movil debe tener un formato correcto.'
        }
        return options.get('movil')?.hasError('required') ? 'Campo requerido' : '';
      }

      erroresFecha(options:FormGroup){
        if(options.get('fecha')?.hasError('max')){
          return 'Debes tener más de 10 años.'
        }
        if(options.get('fecha')?.hasError('min')){
          return 'Debes tener menos de 100 años.'
        }
        return options.get('fecha')?.hasError('required') ? 'Campo requerido' : '';
      }
      erroresSexo(options:FormGroup){
        return options.get('sexo')?.hasError('required') ? 'Campo requerido' : '';
      }
    
      erroresPassword2(options:FormGroup){
        if(options.get('password2')?.hasError('MustMatch')){
          return 'Las contraseñas no son iguales.'
        }
        return options.get('password2')?.hasError('required') ? 'Campo requerido' : '';
      }
}