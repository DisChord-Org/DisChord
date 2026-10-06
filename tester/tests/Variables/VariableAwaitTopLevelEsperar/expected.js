import { chordEsperar } from './lib/runtimeHelpers.js';
await chordEsperar(10);
async function f() {
    await chordEsperar(10);
}
