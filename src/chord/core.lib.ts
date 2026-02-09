const originalLog = console.log;

console.log = (...args) => {
    const translatedArgs = args.map((arg: any) => {
        if (arg === true) return 'verdadero';
        if (arg === false) return 'falso';
        if (arg === null || arg === undefined) return 'indefinido';

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
                "longitud": "length",
                "terminaCon": "endsWith",
                "empiezaCon": "startsWith",
                "repetir": "repeat",
                "cortar": "slice",
                "minusculas": "toLowerCase",
                "mayusculas": "toUpperCase"
            }
        },
        "Lista": {
            methods: {
                "agregar": "push",
                "quitarUltimo": "pop",
                "unir": "join",
                "mapear": "map",
                "llenar": "fill",
                "todos": "every",
                "filtrar": "filter",
                "encontrar": "find",
                "tiene": "includes",
                "longitud": "length",
                "cortar": "slice"
            }
        }
    },
} as const;
