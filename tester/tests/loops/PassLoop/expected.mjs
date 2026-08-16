import './lib/consoleRuntime.mjs';
for (let valor = 0; valor < 10; valor++) {
    if (valor == 5) {
        continue;
    }
    console.log(valor);
}
