import { chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function f(c) {
    return chordTiene(c, 'a');
}
console.log(f('abc'));
console.log(f(new Map()));
