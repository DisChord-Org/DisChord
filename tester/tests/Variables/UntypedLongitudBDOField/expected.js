import { chordLongitud } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function largo(p) {
    return chordLongitud(p);
}
let obj = { longitud: 5 };
console.log(largo(obj));
