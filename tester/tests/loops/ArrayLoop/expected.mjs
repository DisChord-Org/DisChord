import './lib/consoleRuntime.mjs';
let milista = ['uno', 'dos', 'tres'];
for (let item of Array.isArray(milista) ? milista : Object.keys(milista)) {
    console.log(item);
}
