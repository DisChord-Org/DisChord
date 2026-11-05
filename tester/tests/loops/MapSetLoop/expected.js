import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let m = new Map();
let s = new Set();
for (let k of chordIterable(m)) {
    console.log(k);
}
for (let e of chordIterable(s)) {
    console.log(e);
}
