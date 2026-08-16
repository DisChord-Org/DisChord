import './lib/consoleRuntime.js';
let a = { uno: 1, dos: 2, tres: 3 };
for (let item of Array.isArray(a) ? a : Object.keys(a)) {
    console.log(item);
}
