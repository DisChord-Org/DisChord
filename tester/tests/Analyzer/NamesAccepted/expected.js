import './lib/consoleRuntime.js';
console.log(despues(2));
function despues(n) {
    if (n > 0) {
        return despues(n - 1);
    }
    return n;
}
for (let i = 0; i < 2; i++) {
    console.log(i);
}
let chainsawman = (() => {
    let makima = 'narcisista';
    let denji = 'mascota de una ' + makima;

    return { makima, denji };
})();
let n = 1;
function sombra() {
    let n = 2;
    console.log(n);
}
class Caja {
    uno() {
        return 1;
    }

    dos() {
        return this.uno();
    }
}
console.log(Math.PI);
console.log(JSON.stringify(1));
let pausa = setTimeout;
x;
