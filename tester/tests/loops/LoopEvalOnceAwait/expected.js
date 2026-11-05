import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let llamadas = 0;
async function obtener() {
    llamadas = llamadas + 1;
    return [1, 2, 3];
}
for (let n of chordIterable(await obtener())) {
    console.log(n);
}
console.log(llamadas);
