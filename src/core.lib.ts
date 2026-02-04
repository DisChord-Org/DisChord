const originalLog = console.log;

console.log = (...args) => {
    const translatedArgs = args.map((arg: any) => {
        if (arg === true) return 'verdadero';
        if (arg === false) return 'falso';
        if (arg === null) return 'nulo';
        if (arg === undefined) return 'indefinido';

        return arg;
    });
    
    originalLog(...translatedArgs);
};

export const corelib: Record<string, any> = {
    "classes": {
        "consola": {
            "static": true,
            "methods": {
                "imprimir": "console.log",
                "limpiar": "console.clear"
            }
        },
        "Texto": {
            methods: {
                "limpiar": "trim",
                "partir": "split",
                "reemplazar": "replace",
                "longitud": "length"
            }
        },
        "Lista": {
            methods: {
                "agregar": "push",
                "quitarUltimo": "pop",
                "unir": "join",
                "mapear": "map"
            }
        }
    },
} as const;
