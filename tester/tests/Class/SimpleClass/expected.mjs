const originalLog = console.log;

console.log = (...args) => {
    const translatedArgs = args.map((arg) => {
        if (arg === true) return 'verdadero';
        if (arg === false) return 'falso';
        if (arg === null || arg === undefined) return 'indefinido';

        return arg;
    });

    originalLog(...translatedArgs);
};

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
