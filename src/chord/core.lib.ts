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