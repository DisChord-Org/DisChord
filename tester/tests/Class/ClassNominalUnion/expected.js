import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
class B extends A {}
let u = new B();
console.log(u.dato());
