import { chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
class Caja {
    tiene(x) {
        return 'caja ' + x;
    }
}
function hayEn(c, x) {
    return chordTiene(c, x);
}
console.log(hayEn(new Caja(), 'a'));
