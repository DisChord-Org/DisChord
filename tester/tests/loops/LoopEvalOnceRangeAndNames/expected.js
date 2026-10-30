import './lib/consoleRuntime.js';
let lista = [1, 2];
let obj = { k: 1 };
for (let i = 0; i < 2; i++) {
    console.log(i);
}
for (let x of Array.isArray(lista) || typeof lista === 'string' || lista instanceof Set
    ? lista
    : lista instanceof Map
      ? lista.keys()
      : Object.keys(lista)) {
    console.log(x);
}
for (let k of Array.isArray(obj) || typeof obj === 'string' || obj instanceof Set
    ? obj
    : obj instanceof Map
      ? obj.keys()
      : Object.keys(obj)) {
    console.log(k);
}
