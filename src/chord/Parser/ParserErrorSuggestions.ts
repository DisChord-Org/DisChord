import { TokenType } from "../types";

/**
 * Registry mapping structural parser token type failures to intuitive user-friendly troubleshooting suggestions.
 * Tailored specifically for Spanish educational contexts within the DisChord compiler ecosystem.
 */
export const SUGGESTIONS: Record<string, string> = {
    [TokenType.R_BRACE]: "Después de un bloque debes cerrarlo usando la llave '}'",
    [TokenType.R_PAREN]: "Se te olvidó cerrar el paréntesis ')'",
    [TokenType.Es]: "Se necesita la palabra 'es' para asignar el valor",
    [TokenType.R_SQUARE]: "Después de declarar una lista se debe cerrar con el corchete de cierre ']'",
    [TokenType.IDENTIFICADOR]: "Se esperaba un identificador aquí"
} as const;