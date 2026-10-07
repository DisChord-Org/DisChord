import './lib/consoleRuntime.js';
function contar(t) {
    return t.split(',').length;
}
function fijar(p) {
    p.dia.mes = 3;
    return p.dia.mes;
}
let u = { dia: { mes: 1 } };
console.log(contar('a,b'));
console.log(fijar(u));
