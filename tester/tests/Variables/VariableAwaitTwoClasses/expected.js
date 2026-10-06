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
let a = new A();
let b = new B();
await a.cargar();
b.cargar();
