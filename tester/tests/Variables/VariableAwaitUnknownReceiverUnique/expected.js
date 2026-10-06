class Servicio {
    async cargar() {
        return 5;
    }
}
async function g(x) {
    await x.cargar();
}
