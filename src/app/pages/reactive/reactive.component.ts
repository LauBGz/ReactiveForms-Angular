import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

    forma: FormGroup;

    constructor(private fb: FormBuilder,
                private validadores: ValidadoresService) { 
        //FormBuilder es un servicio que ayuda en la creación del formulario con diversos métodos
        this.crearFormulario();
        this.cargarDataAlFormulario();
        // this.crearListeners();

    }

    ngOnInit(): void {
    }

    //De esta manera indicamos que queremos coger del formulario "pasatiempos" como un array
    //Así es más fácil hacer en ngFor porque podemos hacerlo directamente sobre el pasatiempos.controls que estamos obteniendo de este get
    get pasatiempos(){
        return this.forma.get("pasatiempos") as FormArray;
    };

    get nombreNoValido() {  
        return this.forma.get('nombre').invalid && this.forma.get('nombre').touched
    };

    get apellidoNoValido() {
        return this.forma.get('apellido').invalid && this.forma.get('apellido').touched
    };

    get correoNoValido() {
        return this.forma.get('correo').invalid && this.forma.get('correo').touched
    };

    get usuarioNoValido() {
        return this.forma.get('usuario').invalid && this.forma.get('usuario').touched
    };

    get distritoNoValido() {
        return this.forma.get('direccion.distrito').invalid && this.forma.get('direccion.distrito').touched
    };

    get ciudadNoValido() {
        return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.ciudad').touched
    };
    
    //Comprobar que las 2 contraseñas son iguales
    //Primero creamos una función para validar la contraseña 1
    get pass1NoValido() {
        return this.forma.get('pass1').invalid && this.forma.get('pass1').touched
    };
    
    //Después validamos la contraseña 2 en base a la 1
    get pass2NoValido() {
        const pass1 = this.forma.get('pass1').value;
        const pass2 = this.forma.get('pass2').value;

        return( pass1 === pass2) ? false : true;
    };

    //De esta manera podemos aplicar la validación al interfaz del formulario
    //Sin embargo, internamente, el formulario sigue siendo válido aunque las contraseñas sean diferentes
    //Por eso tenemos que crear una validación especial a nivel de formulario

    crearFormulario() {
        this.forma = this.fb.group({
            //Primer valor: valor por defecto, segundo, validadores síncronos, tercero, validadores asíncronos
            //Si no hay síncronos pero sí asíncronos se deja en segundo lugar vacío y ,
            nombre: ['', [Validators.required, Validators.minLength(5)]],
            apellido: ['', [Validators.required, this.validadores.noApellido]],
            correo: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
            usuario: ['', , this.validadores.existeUsuario],
            //Una validación de este tipo (existeUsuario) manda todo el control y ahí ya tenemos el valor que necesitamos
            pass1: ['', Validators.required],
            pass2: ['', Validators.required],
            direccion: this.fb.group({
                distrito: ['', Validators.required],
                ciudad: ['', Validators.required]
            }),
            //Crear campos de arrays
            pasatiempos: this.fb.array([])//Al menos tiene que haber un array
        }, {
            validators: this.validadores.passwordsIguales('pass1', 'pass2')   
        });
    };

    // crearListeners(){
    //     // //Avisa de cualquier cambio. Es un observable
    //     // this.forma.valueChanges.subscribe(valor => {console.log(valor)});

    //     // //Avisa del estado del formulario
    //     // //Primera se hacen las tareas síncronas y después las asíncronas
    //     // this.forma.statusChanges.subscribe(status => console.log({status}));
        
    //     //Cambios en un campo concreto
    //     this.forma.get('nombre').valueChanges.subscribe(console.log)
    // }
    
    // arrayEjemplo: string [] = ["Ejemplo: leer"];

    cargarDataAlFormulario(){
        this.forma.setValue(
            //Se tienen que poner todos los campos, aunque sea vacíos o dará error
            {
                nombre: "",
                apellido: "",
                correo: "",
                pass1:"",
                pass2:"",
                usuario:"",
                direccion: {
                  distrito: "",
                  ciudad: ""
                },
                pasatiempos: []
            }
        );
        //Ejemplo para cargar datos array
        // this.arrayEjemplo.forEach( pasatiempo => this.pasatiempos.push(this.fb.control(pasatiempo)));
    };

    agregarPasatiempo(){
        //Pasatiempos lo obtenemos directamente del get de arriba
        //Hay que añadir un form control que puede tener todos los elementos vistos al crear un formulario
        //Por ejemplo this.pasatiempos.push(this.fb.control('Nuevo elemento', Validators.required))
       this.pasatiempos.push(this.fb.control(''))
    };

    borrarPasatiempo(i:number){
        this.pasatiempos.removeAt(i);
    };

    guardar(){
        if(this.forma.invalid){
            //Comprobar que todos los campos son válidos
            return Object.values(this.forma.controls).forEach(control => {
                //Si hay otro objeto form dentro que compruebe sus controles también (campos anidados)
                if(control instanceof FormGroup){
                    Object.values(control.controls).forEach(control => {control.markAsTouched();})
                } else {
                    control.markAsTouched();
                }
            });
        }
    }


}
