import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
class B extends A {}
function crear() {
    return new B();
}
console.log(crear().dato());
