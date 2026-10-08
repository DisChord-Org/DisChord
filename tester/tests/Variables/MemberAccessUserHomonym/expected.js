import './lib/consoleRuntime.js';
class Caja {
    partir(x) {
        return x;
    }
}
function g(p) {
    return p.partir(',');
}
let c = new Caja();
console.log(c.partir('a'));
console.log(g(c));
