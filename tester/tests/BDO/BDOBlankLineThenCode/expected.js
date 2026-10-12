import './lib/consoleRuntime.js';
let persona = (() => {
    let nombre = 'Juan';
    let edad = 30;
    console.log('creada');
    return { nombre, edad };
})();
