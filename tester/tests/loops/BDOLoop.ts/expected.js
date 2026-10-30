import './lib/consoleRuntime.js';
let a = { uno: 1, dos: 2, tres: 3 };
for (let item of Array.isArray(a) || typeof a === 'string' || a instanceof Set
    ? a
    : a instanceof Map
      ? a.keys()
      : Object.keys(a)) {
    console.log(item);
}
