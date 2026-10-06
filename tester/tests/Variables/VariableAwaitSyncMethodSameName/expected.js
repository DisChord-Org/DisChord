async function cargar() {
    return 1;
}
class Caja {
    cargar() {
        return 2;
    }
}
let c = new Caja();
function g() {
    c.cargar();
}
