import { chordIterable } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
let llamadas = 0;
function obtener() {
    llamadas = llamadas + 1;
    return { uno: 1, dos: 2 };
}
for (let clave of chordIterable(obtener())) {
    console.log(clave);
}
console.log(llamadas);
