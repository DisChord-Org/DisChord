import './lib/consoleRuntime.js';
let g = 1;
function f() {
    g = 'x';
}
let h = g;
f();
console.log(h);
