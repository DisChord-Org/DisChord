import './lib/consoleRuntime.js';
let r = await Promise.all([await Promise.resolve(1), await Promise.resolve(2)]);
console.log(r);
