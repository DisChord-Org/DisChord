import { chordTamano } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function tam(p) {
    return chordTamano(p);
}
let obj = { tamano: 7 };
console.log(tam(obj));
