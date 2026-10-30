import './lib/consoleRuntime.js';
let m = new Map();
let s = new Set();
for (let k of Array.isArray(m) || typeof m === 'string' || m instanceof Set
    ? m
    : m instanceof Map
      ? m.keys()
      : Object.keys(m)) {
    console.log(k);
}
for (let e of Array.isArray(s) || typeof s === 'string' || s instanceof Set
    ? s
    : s instanceof Map
      ? s.keys()
      : Object.keys(s)) {
    console.log(e);
}
