import './lib/consoleRuntime.js';
class A {
    s() {
        return 1;
    }

    async a() {
        return 2;
    }
}
class B extends A {
    s() {
        return 10;
    }

    async a() {
        return 20;
    }

    async nuevo2() {
        return 30;
    }
}
async function principal() {
    let x = new B();
    console.log(x.s());
    console.log(await x.a());
}
await principal();
