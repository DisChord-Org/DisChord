class A {
    async deA() {
        return 1;
    }
}
class B extends A {}
let b = new B();
await b.deA();
