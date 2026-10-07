import './lib/consoleRuntime.js';
class Hoja {
    async dato() {
        return { c: 5 };
    }
}
async function raiz() {
    return new Hoja();
}
console.log((await (await raiz()).dato()).c);
