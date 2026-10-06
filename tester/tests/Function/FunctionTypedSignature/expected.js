import './lib/consoleRuntime.js';
function hayEn(coleccion, x) {
    return coleccion.has(x);
}
function saludar(nombre) {
    console.log(nombre);
}
let m = new Map();
console.log(hayEn(m, 'a'));
saludar('hola');
