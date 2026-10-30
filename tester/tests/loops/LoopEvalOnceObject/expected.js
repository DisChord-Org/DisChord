import './lib/consoleRuntime.js';
let llamadas = 0;
function obtener() {
    llamadas = llamadas + 1;
    return { uno: 1, dos: 2 };
}
for (let clave of ((value) =>
    Array.isArray(value) || typeof value === 'string' || value instanceof Set
        ? value
        : value instanceof Map
          ? value.keys()
          : Object.keys(value))(obtener())) {
    console.log(clave);
}
console.log(llamadas);
