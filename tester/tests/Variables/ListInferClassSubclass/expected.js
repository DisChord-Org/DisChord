import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
class B extends A {}
let x = [new B(), new A()];
console.log(x[1].dato());
