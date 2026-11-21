import { cargar, leer, procesar, interna } from '../lib/tareas/src/index.js';
async function principal() {
    let datos = await cargar('a.json');
    leer('a.json');
    procesar();
    interna();
    return datos;
}
await principal();
