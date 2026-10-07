import { chordLimpiar } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function limpio(c) {
    return chordLimpiar(c);
}
let m = new Map();
m.set('a', 1);
console.log(limpio('  hola  '));
limpio(m);
console.log(m.size);
