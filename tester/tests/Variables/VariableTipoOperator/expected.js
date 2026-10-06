import './lib/consoleRuntime.js';
console.log(
    ((v) =>
        v === null
            ? 'indefinido'
            : Array.isArray(v)
              ? 'lista'
              : { number: 'numero', string: 'texto', boolean: 'booleano', undefined: 'indefinido', object: 'bdo' }[
                    typeof v
                ])(5),
);
console.log(
    ((v) =>
        v === null
            ? 'indefinido'
            : Array.isArray(v)
              ? 'lista'
              : { number: 'numero', string: 'texto', boolean: 'booleano', undefined: 'indefinido', object: 'bdo' }[
                    typeof v
                ])('a'),
);
console.log(
    ((v) =>
        v === null
            ? 'indefinido'
            : Array.isArray(v)
              ? 'lista'
              : { number: 'numero', string: 'texto', boolean: 'booleano', undefined: 'indefinido', object: 'bdo' }[
                    typeof v
                ])([1, 2]),
);
console.log(
    ((v) =>
        v === null
            ? 'indefinido'
            : Array.isArray(v)
              ? 'lista'
              : { number: 'numero', string: 'texto', boolean: 'booleano', undefined: 'indefinido', object: 'bdo' }[
                    typeof v
                ])({ a: 1 }),
);
