import './lib/consoleRuntime.js';
let llamadas = 0;
async function obtener() {
    llamadas = llamadas + 1;
    return [1, 2, 3];
}
for (let n of ((value) =>
    Array.isArray(value) || typeof value === 'string' || value instanceof Set
        ? value
        : value instanceof Map
          ? value.keys()
          : Object.keys(value))(await obtener())) {
    console.log(n);
}
console.log(llamadas);
