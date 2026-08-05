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

let milista = ['uno', 'dos', 'tres'];
for (let item of Array.isArray(milista) ? milista : Object.keys(milista)) {
    console.log(item);
}
