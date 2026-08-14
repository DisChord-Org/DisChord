export const runtimeInjections = `
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
` as const;

export const corelib: Record<string, any> = {
    "classes": {
        "consola": {
            "static": true,
            "methods": {
                "imprimir": "console.log",
                "error": "console.error",
                "advertencia": "console.warn",
                "limpiar": "console.clear"
            }
        },
        "Texto": {
            methods: {
                "limpiar": "trim",
                "partir": "split",
                "reemplazar": "replace",
                "reemplazarTodo": "replaceAll",
                "longitud": "length",
                "terminaCon": "endsWith",
                "empiezaCon": "startsWith",
                "repetir": "repeat",
                "cortar": "slice",
                "minusculas": "toLowerCase",
                "mayusculas": "toUpperCase",
                "tiene": "includes",
                "indiceDe": "indexOf",
                "ultimoIndiceDe": "lastIndexOf",
                "caracterEn": "charAt",
                "rellenarInicio": "padStart",
                "rellenarFinal": "padEnd",
                "concatenar": "concat"
            }
        },
        "Lista": {
            methods: {
                "agregar": "push",
                "quitarUltimo": "pop",
                "quitarPrimero": "shift",
                "agregarInicio": "unshift",
                "unir": "join",
                "mapear": "map",
                "llenar": "fill",
                "todos": "every",
                "algunos": "some",
                "filtrar": "filter",
                "encontrar": "find",
                "tiene": "includes",
                "longitud": "length",
                "cortar": "slice",
                "invertir": "reverse",
                "ordenar": "sort",
                "reducir": "reduce",
                "aplanar": "flat",
                "paraCada": "forEach",
                "indiceDe": "indexOf",
                "ultimoIndiceDe": "lastIndexOf",
                "concatenar": "concat"
            }
        }
    },
} as const;