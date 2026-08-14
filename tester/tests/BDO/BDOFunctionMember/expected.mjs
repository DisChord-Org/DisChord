const originalLog = console.log;

console.log = (...args) => {
    const translatedArgs = args.map((arg) => {
        if (arg === true) return 'verdadero';
        if (arg === false) return 'falso';
        if (arg === null || arg === undefined) return 'indefinido';

        return arg;
    });

    originalLog(...translatedArgs);
};

let persona = (() => {
    let nombre = 'Juan';
    function saludar() {
        console.log('Hola, ' + this.nombre);
    }
    return { nombre, saludar };
})();
persona.saludar();
