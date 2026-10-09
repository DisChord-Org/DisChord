import { chordLongitud } from './lib/runtimeHelpers.js';
import './lib/consoleRuntime.js';
async function lista() {
    return [7, 8];
}
console.log((await lista())[0]);
console.log(chordLongitud(await lista()));
