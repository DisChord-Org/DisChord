import { chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function hayEn(c, x) {
    return chordTiene(c, x);
}
let m = new Map();
m.set('a', 1);
let cj = new Set();
cj.add('a');
console.log(hayEn('abc', 'b'));
console.log(hayEn(['a'], 'a'));
console.log(hayEn(m, 'a'));
console.log(hayEn(cj, 'z'));
