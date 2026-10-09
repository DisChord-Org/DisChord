import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
let l = [new A(), new A()];
let x = l;
console.log(x[0].dato());
