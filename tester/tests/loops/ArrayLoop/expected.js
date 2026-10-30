import './lib/consoleRuntime.js';
let milista = ['uno', 'dos', 'tres'];
for (let item of Array.isArray(milista) || typeof milista === 'string' || milista instanceof Set
    ? milista
    : milista instanceof Map
      ? milista.keys()
      : Object.keys(milista)) {
    console.log(item);
}
