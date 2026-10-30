import './lib/consoleRuntime.js';
for (let c of Array.isArray('a👍b') || typeof 'a👍b' === 'string' || 'a👍b' instanceof Set
    ? 'a👍b'
    : 'a👍b' instanceof Map
      ? 'a👍b'.keys()
      : Object.keys('a👍b')) {
    console.log(c);
}
