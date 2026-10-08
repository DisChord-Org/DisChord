import { chordLimpiar, chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
async function nombre() {
    return ' ab ';
}
async function principal() {
    console.log(chordTiene(await nombre(), 'a'));
    console.log(chordLimpiar(await nombre()));
}
await principal();
