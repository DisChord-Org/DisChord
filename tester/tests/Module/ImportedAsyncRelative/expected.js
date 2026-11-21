import { cargar, leer } from './otro.js';
async function principal() {
    await cargar('a.json');
    leer('a.json');
}
await principal();
