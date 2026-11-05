import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
for (let c of chordIterable('a👍b')) {
    console.log(c);
}
