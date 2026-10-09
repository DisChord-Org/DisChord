import './lib/consoleRuntime.js';
class A {
    dato() {
        return 1;
    }
}
function usar(x) {
    return x.dato();
}
class B extends A {
    probar() {
        return usar(this);
    }
}
console.log(new B().probar());
