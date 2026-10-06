import './lib/consoleRuntime.js';
class Caja {
    constructor(a) {
        this.a = a;
    }

    pesar(kilos) {
        return kilos;
    }
}
let c = new Caja('x');
console.log(c.pesar(2));
