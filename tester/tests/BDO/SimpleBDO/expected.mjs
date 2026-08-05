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

let armario = { peso: 26.83, precio: 100, color: 'marron' };
console.log(armario);
