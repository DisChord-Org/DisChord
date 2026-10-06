class Caja {
    async cargar() {
        return 1;
    }
}
async function f(c) {
    return await c.cargar();
}
