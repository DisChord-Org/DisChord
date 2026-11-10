import { chordEsperar } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
function g() {
    console.log('g');
}
async function pausa() {
    console.log('pausa');
}
function devuelve() {
    return g();
}
async function principal() {
    await pausa();
    await chordEsperar(1);
}
let mapa = new Map();
mapa.set('a', 1).set('b', 2);
let conjunto = new Set();
conjunto.add(1).add(2);
mapa.clear();
conjunto.clear();
g();
for (let i = 0; i < 2; i++) {
    g();
}
if (true) {
    g();
} else {
    g();
}
await principal();
