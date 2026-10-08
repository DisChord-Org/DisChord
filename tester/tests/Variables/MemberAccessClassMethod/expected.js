import './lib/consoleRuntime.js';
class Caja {
    x = 'a';

    f() {
        return this.x.toUpperCase();
    }
}
console.log(new Caja().f());
