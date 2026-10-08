import './lib/consoleRuntime.js';
function fijar(p) {
    p.longitud = 3;
}
let u = { longitud: 1 };
fijar(u);
console.log(u.longitud);
