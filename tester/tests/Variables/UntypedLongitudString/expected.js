import { chordLongitud } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function largo(p) {
    return chordLongitud(p);
}
console.log(largo('abc'));
