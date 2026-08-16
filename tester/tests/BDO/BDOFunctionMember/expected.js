import './lib/consoleRuntime.js';
let persona = (() => {
    let nombre = 'Juan';
    function saludar() {
        console.log('Hola, ' + this.nombre);
    }
    return { nombre, saludar };
})();
persona.saludar();
