import { chordLimpiar } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
async function nombre() {
    return ' ab ';
}
console.log((await nombre()).toUpperCase());
console.log(chordLimpiar(await nombre()));
