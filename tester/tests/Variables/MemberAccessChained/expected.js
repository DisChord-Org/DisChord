import './lib/consoleRuntime.js';
function leer(a) {
    console.log(a.dia.mes);
    return a.b.c();
}
let u = { dia: { mes: 1 } };
console.log(leer(u));
