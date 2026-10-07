import './lib/consoleRuntime.js';
async function lista() {
    return [7, 8];
}
async function nombre() {
    return 'a';
}
console.log(await lista());
let s = (await nombre()) + 'x';
async function principal() {
    if (await lista()) {
        console.log(1);
    }
    return await lista();
}
