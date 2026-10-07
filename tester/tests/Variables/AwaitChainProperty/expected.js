import './lib/consoleRuntime.js';
class Repo {
    async leer(x) {
        return 'abcd';
    }
}
let repo = new Repo();
console.log((await repo.leer(3)).length);
