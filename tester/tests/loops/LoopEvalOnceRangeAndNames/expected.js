import './lib/consoleRuntime.js';
let lista = [1, 2];
let obj = { k: 1 };
for (let i = 0; i < 2; i++) {
    console.log(i);
}
for (let x of Array.isArray(lista) ? lista : Object.keys(lista)) {
    console.log(x);
}
for (let k of Array.isArray(obj) ? obj : Object.keys(obj)) {
    console.log(k);
}
