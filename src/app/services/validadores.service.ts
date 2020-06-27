import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface ErrorValidate {
    [s:string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

    constructor() { }

    //Creamos una colección de validadores

    //Ejemplo petición asíncrona
    existeUsuario(control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate>{
        //Devuelve una promesa o un observable que resuelve ErrorValidate [s:string]: boolean

        //Si el valor del control no existe que la promesa se resuelva a null, o sea, hasta que se escribe algo no se hace el return
        if(!control.value){
            return Promise.resolve(null);
        };

        return new Promise ( (resolve, reject) => {
            setTimeout(() => {
                if ( control.value === 'LauBGz'){
                    resolve({existe: true});
                } else {
                    resolve(null);
                }
            }, 3500);
        }
    )};

    noApellido(control: FormControl): ErrorValidate {
    //Recibimos como argumento un control del formulario
    //Si el valor existe, lo pasamos a lower case. Así si es null no hace validación y no da error 
        if(control.value?.toLowerCase() === "apellido"){
            return {
                noApellido: true
            }
        }
        return null;
    };

    //Comprobar que las passwords son iguales
    passwordsIguales( pass1Name: string, pass2Name: string){
        return (formGroup: FormGroup) => {
            const pass1Control =  formGroup.controls[pass1Name];
            const pass2Control =  formGroup.controls[pass2Name];

            if(pass1Control.value === pass2Control.value){
                pass2Control.setErrors(null);
            }else {
                pass2Control.setErrors({noEsIgual: true});
            }
        }
    }
}
