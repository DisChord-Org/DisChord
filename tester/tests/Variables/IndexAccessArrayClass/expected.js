import './lib/consoleRuntime.js';
let l = [new Map()];
console.log(l[0].has('a'));
l[0].set('a', 1);
console.log(l[0].size);
