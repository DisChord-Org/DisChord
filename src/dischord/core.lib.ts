export const corelib: Record<string, Record<string, string> | string> = {
    'usuario': {
        'nombre': 'usuario.username'
    },
    'imprimir': 'cliente.logger.info'
} as const;