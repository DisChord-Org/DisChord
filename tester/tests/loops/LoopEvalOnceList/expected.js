import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let llamadas = 0;
function obtener() {
    llamadas = llamadas + 1;
    return ['a', 'b'];
}
for (let item of chordIterable(obtener())) {
    console.log(item);
}
console.log(llamadas);
