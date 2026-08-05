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

for (let valor = 0; valor < 10; valor++) {
    if (valor == 5) {
        continue;
    }
    console.log(valor);
}
