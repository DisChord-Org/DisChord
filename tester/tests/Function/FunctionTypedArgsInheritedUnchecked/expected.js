class A {}
class B extends A {}
class E extends Z {}
class F extends G {}
class G extends F {}
let b = new B(1, 2);
let e = new E(1);
let f = new F(1);
