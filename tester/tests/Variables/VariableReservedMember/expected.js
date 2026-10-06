import { chordEntre } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let lista = [1, 2];
let a = lista.at(0);
let r = chordEntre(1, 6);
let x = 1.5;
let obj = { clave: 1 };
let s = obj.si;
let m = obj.mas;
let w = obj.y(1);
let v = obj.verdadero;
let e = obj.espacio;
let enc = lista.at(0).entre(1);
class Caja {
    en = 1;

    entre = 2;

    si() {
        return this.en;
    }

    y(n) {
        return n;
    }
}
let c = new Caja();
let d = c.en;
let f = c.si();
let g = c.y(1);
console.log(a);
console.log(r);
