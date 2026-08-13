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

let nota = 7;
if (nota >= 9) {
    console.log('Excelente');
} else if (nota >= 6) {
    console.log('Aprobado');
} else {
    console.log('Reprobado');
}
