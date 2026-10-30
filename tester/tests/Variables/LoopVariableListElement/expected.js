import './lib/consoleRuntime.js';
let l = [new Map()];
for (let m of Array.isArray(l) || typeof l === 'string' || l instanceof Set
    ? l
    : l instanceof Map
      ? l.keys()
      : Object.keys(l)) {
    console.log(m.has(1));
}
