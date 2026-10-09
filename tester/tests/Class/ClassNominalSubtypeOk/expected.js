import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
class B extends A {}
function f(x) {
    return x.dato();
}
let a = new B();
console.log(f(new B()));
console.log(a.dato());
