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

let panas = (() => {
    let Ether = 'está chetado';
    let JustEvil = 'goat';
    let ZendrYz = 'wen pibe';
    console.log(JustEvil);
    JustEvil = 'la cabra';
    return { Ether, JustEvil, ZendrYz };
})();
console.log(panas);
