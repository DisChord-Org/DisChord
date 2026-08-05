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

let chainsawman = (() => {
    let makima = 'narcisista';
    let denji = 'mascota de una ' + makima;

    return { makima, denji };
})();
console.log(chainsawman);
