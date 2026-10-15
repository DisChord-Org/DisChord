let activo = true;
let n = 3;
let valor = false;
let a = 'activo: ' + (activo ? 'verdadero' : 'falso') + ', n: ' + n;
let b = '' + (activo ? 'verdadero' : 'falso') + ' y ' + (!activo ? 'verdadero' : 'falso');
let c = 'sin tipo: ' + valor;
let d =
    'mayor: ' +
    (n > 2 ? 'verdadero' : 'falso') +
    ', tipo: ' +
    ((v) =>
        v === null
            ? 'indefinido'
            : Array.isArray(v)
              ? 'lista'
              : { number: 'numero', string: 'texto', boolean: 'booleano', undefined: 'indefinido', object: 'bdo' }[
                    typeof v
                ])(n);
