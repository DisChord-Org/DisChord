import './lib/consoleRuntime.js';
function leer(p) {
    console.log(p.dia);
    console.log(p.claves);
    console.log(p.valores);
    console.log(p.buscar);
    let copia = p.dia;
    if (p.dia > 1) {
        console.log(copia);
    }
    return p.dia;
}
let u = { dia: 3, claves: 'k', valores: 'v', buscar: 'b' };
console.log(leer(u));
