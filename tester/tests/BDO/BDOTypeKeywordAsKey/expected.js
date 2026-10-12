let ajustes = { nombre: 'avisos', tipo: 'voz' };
let t = ((v) =>
    v === null
        ? 'indefinido'
        : Array.isArray(v)
          ? 'lista'
          : { number: 'numero', string: 'texto', boolean: 'booleano', undefined: 'indefinido', object: 'bdo' }[
                typeof v
            ])(ajustes);
