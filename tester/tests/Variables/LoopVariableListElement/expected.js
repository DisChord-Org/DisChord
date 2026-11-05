import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let l = [new Map()];
for (let m of chordIterable(l)) {
    console.log(m.has(1));
}
