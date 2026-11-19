function ayuda(n) {
    return n + 1;
}
class Base {
    total = 0;
}
class Contador extends Base {
    valor = 0;

    sumar(valor) {
        let total = valor + 1;
        this.valor = total;
    }

    ayuda() {
        return ayuda(this.valor);
    }
}
