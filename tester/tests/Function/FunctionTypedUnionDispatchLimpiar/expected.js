import { chordLimpiar } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function f(c) {
    return chordLimpiar(c);
}
console.log(f('  abc  '));
