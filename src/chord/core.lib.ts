import { ConditionParser } from "./Parser/Grammar/StatementParser/ConditionParser";
import { LoopParser } from "./Parser/Grammar/StatementParser/LoopParser";
import { VariableParser } from "./Parser/Grammar/StatementParser/VariableParser";

export const StatementMap: Record<string, any> = {
    'CLASE': undefined,
    'PROP': undefined,
    'DEVOLVER': undefined,
    'VAR': VariableParser,
    'FUNCION': undefined,
    'SI': ConditionParser,
    'PARA': LoopParser,
    'PASAR': undefined,
    'SALIR': undefined,
    'IMPORTAR': undefined,
    'EXPORTAR': undefined,
    'TIPO': undefined
} as const;

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

export const SUGGESTIONS: Record<string, string> = {
    'R_BRACE': "Después de un bloque debes cerrarlo usando la llave '}'",
    'R_EXPRESSION': "Se te olvidó cerrar el paréntesis ')'",
    'ES': "Se necesita la palabra 'es' para asignar el valor",
    'R_SQUARE': "Después de declarar una lista se debe cerrar con el corchete de cierre ']'",
    'IDENTIFICADOR': "Se esperaba un identificador aquí"
} as const;