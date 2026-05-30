import { TokenType } from "./types";

/**
 * @file operatorMap.ts
 * @description Single-source-of-truth mapping to translate graphical symbols into official Chord TokenTypes.
 */

/**
 * Translation dictionary that pairs raw mathematical and structural character symbols 
 * with their designated semantic TokenType equivalents in the Chord language.
 * @type {Record<string, TokenType>}
 */
export const SymbolTranslationMap: Record<string, typeof TokenType[keyof typeof TokenType]> = {
    "{": TokenType.L_BRACE,
    "}": TokenType.R_BRACE,
    "(": TokenType.L_PAREN,
    ")": TokenType.R_PAREN,
    "[": TokenType.L_SQUARE,
    "]": TokenType.R_SQUARE,
    ",": TokenType.COMA,
    ".": TokenType.Punto,
    ":": TokenType.DOS_PUNTOS,
    ";": TokenType.SEPARADOR,

    "+": TokenType.Mas,
    "-": TokenType.Menos,
    "*": TokenType.Por,
    "/": TokenType.Entre,
    "**": TokenType.Exponente,
    "%": TokenType.Resto,

    "==": TokenType.Igual,
    "===": TokenType.IgualTipado,
    ">": TokenType.Mayor,
    "<": TokenType.Menor,
    ">=": TokenType.MayorIgual,
    "<=": TokenType.MenorIgual,
    "!=": TokenType.NoIgual,
    "!==": TokenType.NoIgualTipado,

    "&&": TokenType.Y,
    "||": TokenType.O,
    "!": TokenType.No,

    "@": TokenType.Decorador
};