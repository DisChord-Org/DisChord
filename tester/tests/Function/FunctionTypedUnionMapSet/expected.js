import './lib/consoleRuntime.js';
function f(c) {
    return c.has(1);
}
console.log(f(new Set()));
