import { chordAgregar } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function f(c) {
    return chordAgregar(c, 1);
}
console.log(f([]));
console.log(f(new Set()));
