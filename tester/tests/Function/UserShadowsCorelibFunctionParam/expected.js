import { chordEsperar } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function f(esperar) {
    return esperar(5);
}
function mas1(x) {
    return x + 1;
}
console.log(f(mas1));
await chordEsperar(1);
