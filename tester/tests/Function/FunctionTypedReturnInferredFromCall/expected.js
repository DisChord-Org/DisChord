import './lib/consoleRuntime.js';
function hayEn(c, x) {
    return c.has(x);
}
let m = new Map();
let b = hayEn(m, 'a');
let c = hayEn(m, 'a');
console.log(b);
console.log(c);
