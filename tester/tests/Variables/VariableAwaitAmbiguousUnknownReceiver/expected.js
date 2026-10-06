class A {
    async cargar() {
        return 1;
    }
}
class B {
    cargar() {
        return 2;
    }
}
function g(x) {
    x.cargar();
}
