import './lib/consoleRuntime.js';
let llamadas = 0;
function obtener() {
    llamadas = llamadas + 1;
    return ['a', 'b'];
}
for (let item of ((value) => (Array.isArray(value) ? value : Object.keys(value)))(obtener())) {
    console.log(item);
}
console.log(llamadas);
