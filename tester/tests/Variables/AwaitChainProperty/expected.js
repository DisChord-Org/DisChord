import { chordLongitud } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
class Repo {
    async leer(x) {
        return 'abcd';
    }
}
let repo = new Repo();
console.log(chordLongitud(await repo.leer(3)));
