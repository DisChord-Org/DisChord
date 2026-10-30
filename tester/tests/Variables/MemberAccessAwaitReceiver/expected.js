import './lib/consoleRuntime.js';
async function nombre() {
    return ' ab ';
}
async function principal() {
    console.log((await nombre()).includes('a'));
    console.log((await nombre()).trim());
}
await principal();
