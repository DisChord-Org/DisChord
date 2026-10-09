import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
class B extends A {}
class C extends B {}
let a = new C();
console.log(a.dato());
