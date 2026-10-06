import { chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
class Caja {
    tiene(x) {
        return true;
    }
}
function f(c) {
    return chordTiene(c, 1);
}
console.log(f(new Caja()));
