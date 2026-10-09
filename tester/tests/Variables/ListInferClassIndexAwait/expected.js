import './lib/consoleRuntime.js';
class A {
    async dato() {
        return 1;
    }
}
class B {
    dato() {
        return 2;
    }
}
let l = [new A()];
console.log(await l[0].dato());
