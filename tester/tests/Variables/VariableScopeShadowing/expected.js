import './lib/consoleRuntime.js';
let x = 1;
function sombra() {
    let x = 'a';
    x = 'b';
}
x = 2;
console.log(x);
