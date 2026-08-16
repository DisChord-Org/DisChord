import './lib/consoleRuntime.mjs';
class Animal {
    constructor(nombre) {
        this.nombre = nombre;
    }

    hablar() {
        console.log(this.nombre + ' hace un sonido');
    }
}
class Perro extends Animal {
    constructor(nombre) {
        super(nombre);
    }

    hablar() {
        console.log(this.nombre + ' ladra');
    }
}
let perro = new Perro('Rex');
perro.hablar();
