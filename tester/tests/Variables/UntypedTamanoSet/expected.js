import { chordTamano } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function tam(p) {
    return chordTamano(p);
}
let c = new Set();
c.add(1);
console.log(tam(c));
