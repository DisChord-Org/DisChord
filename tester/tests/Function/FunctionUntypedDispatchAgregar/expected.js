import { chordAgregar } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function sumar(c, x) {
    chordAgregar(c, x);
}
let l = [1];
let cj = new Set();
sumar(l, 2);
sumar(cj, 2);
console.log(l);
console.log(cj.size);
