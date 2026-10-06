class Caja {
    async cargar() {
        return 1;
    }
}
class Otra {
    cargar() {
        return 2;
    }
}
function f(c) {
    return c.cargar();
}
