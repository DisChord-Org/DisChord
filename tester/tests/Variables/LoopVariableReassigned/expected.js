import { chordIterable } from './lib/runtimeHelpers.js';
let l = [1, 2];
for (let x of chordIterable(l)) {
    x = 'a';
    let r = x;
}
