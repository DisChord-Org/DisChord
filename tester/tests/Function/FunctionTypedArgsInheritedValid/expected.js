import './lib/consoleRuntime.js';
class A {
    constructor(x) {
        this.x = x;
    }

    dato() {
        return this.x;
    }
}
class B extends A {}
class C extends B {}
class D extends A {
    constructor() {
        super(7);
    }
}
let c = new C(5);
console.log(c.dato());
console.log(new D().dato());
