export const corelib: Record<string, any> = {
    "classes": {
        "consola": {
            "static": true,
            "methods": {
                "imprimir": "console.log",
                "limpiar": "console.clear"
            }
        }
    },
} as const;
