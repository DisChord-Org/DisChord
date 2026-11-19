import './lib/consoleRuntime.js';
let t = 'hola';
let l = [1, 2];
let m = new Map();
let u = 'a';
let c = 'a';
l.push(3);
m.set('a', 1);
console.log(t.toUpperCase(), l.length, m.size, u.noExiste, c.noExiste, t.length, m.size);
