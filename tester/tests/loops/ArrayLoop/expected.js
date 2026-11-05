import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let milista = ['uno', 'dos', 'tres'];
for (let item of chordIterable(milista)) {
    console.log(item);
}
