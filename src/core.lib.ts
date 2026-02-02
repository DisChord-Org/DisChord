export const corelib: Record<string, any> = {
    "classes": {
        "consola": {
            "static": true,
            "mainMethod": "escribir",
            "methods": {
                "escribir": "console.log",
                "limpiar": "console.clear"
            }
        }
    }
} as const;
