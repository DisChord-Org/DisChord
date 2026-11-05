import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let a = { uno: 1, dos: 2, tres: 3 };
for (let item of chordIterable(a)) {
    console.log(item);
}
