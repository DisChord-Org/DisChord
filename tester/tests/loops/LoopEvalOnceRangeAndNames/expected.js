import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let lista = [1, 2];
let obj = { k: 1 };
for (let i = 0; i < 2; i++) {
    console.log(i);
}
for (let x of chordIterable(lista)) {
    console.log(x);
}
for (let k of chordIterable(obj)) {
    console.log(k);
}
