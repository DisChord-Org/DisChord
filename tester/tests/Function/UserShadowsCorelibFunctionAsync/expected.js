import './lib/consoleRuntime.js';
async function esperar(valor) {
    return valor + 100;
}
async function principal() {
    console.log(await esperar(1));
}
await principal();
