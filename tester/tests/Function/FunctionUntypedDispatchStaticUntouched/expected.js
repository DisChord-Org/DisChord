import './lib/consoleRuntime.js';
class Caja {
    tiene(x) {
        return true;
    }

    usar() {
        return this.tiene(1);
    }
}
console.log(new Caja().usar());
