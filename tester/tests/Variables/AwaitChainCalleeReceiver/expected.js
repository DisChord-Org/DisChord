import './lib/consoleRuntime.js';
async function nombre() {
    return ' ab ';
}
console.log((await nombre()).toUpperCase());
console.log((await nombre()).trim());
