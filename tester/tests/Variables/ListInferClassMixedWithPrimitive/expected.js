import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
let m = [1, new A()];
let t = m;
console.log(t[0]);
