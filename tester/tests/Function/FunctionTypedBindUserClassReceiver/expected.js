class Caja {
    async cargar() {
        return 1;
    }

    buscar(x) {
        return x;
    }
}
async function usar(c) {
    await c.cargar();
    c.buscar('a');
}
