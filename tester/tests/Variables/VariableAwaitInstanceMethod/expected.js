class Servicio {
    async cargar() {
        return 5;
    }
}
let s = new Servicio();
await s.cargar();
async function f() {
    await s.cargar();
}
class Otra {
    async usar() {
        await s.cargar();
    }
}
