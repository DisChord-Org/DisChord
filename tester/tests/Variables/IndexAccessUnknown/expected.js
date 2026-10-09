import { chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function f(c) {
    return chordTiene(c[0], 1);
}
console.log(f([[1]]));
