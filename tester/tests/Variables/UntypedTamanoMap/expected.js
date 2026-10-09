import { chordTamano } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function tam(p) {
    return chordTamano(p);
}
let m = new Map();
m.set('a', 1);
console.log(tam(m));
