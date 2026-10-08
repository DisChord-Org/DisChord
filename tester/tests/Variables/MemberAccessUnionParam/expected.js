import { chordTiene } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function hayEn(c) {
    return chordTiene(c, 'a');
}
console.log(hayEn('abc'));
