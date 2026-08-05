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

let a = { uno: 1, dos: 2, tres: 3 };
for (let item of Array.isArray(a) ? a : Object.keys(a)) {
    console.log(item);
}
