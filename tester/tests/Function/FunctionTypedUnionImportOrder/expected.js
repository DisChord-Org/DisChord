import { chordEsperar, chordLimitar, chordLimpiar, chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function f(c, d) {
    chordLimpiar(d);
    return chordTiene(c, 1) && chordTiene(c, 2);
}
await chordEsperar(1);
console.log(chordLimitar(5, 0, 3));
console.log(f('a', new Map()));
