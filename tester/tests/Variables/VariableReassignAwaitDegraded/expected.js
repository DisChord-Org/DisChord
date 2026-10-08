import './lib/consoleRuntime.js';
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
a = 'x';
console.log(a.cargar());
