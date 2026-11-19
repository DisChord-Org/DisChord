import './lib/consoleRuntime.js';
let lista = [1, 2];
let n = 3;
for (let i = 0, _fin = lista.length; i < _fin; i++) {
    lista.push(i);
}
for (let i = 1, _fin = n; i < _fin; i++) {
    for (let j = 0, _fin = i; j < _fin; j++) {
        console.log(j);
    }
}
for (let i = n; i < 5; i++) {
    console.log(i);
}
