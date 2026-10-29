/**
 * @file declarations.ts
 * @description The names a program declares, as the parser records them with where they are written.
 */

import type { Location } from "./tokens";

/**
 * Kinds of name a program declares, as recorded by the parser (see `Parser.declare`).
 * @type {const}
 */
export const DeclarationKind = {
    Class: 'class',
    Function: 'function',
    Method: 'method',
    Constructor: 'constructor',
    Parameter: 'parameter',
    Variable: 'variable',
    Property: 'property',
    Import: 'import'
} as const;

/**
 * A name the source declares, with exactly where it is written: what an editor needs for an
 * outline, go to definition or rename, without a range on every node of the tree.
 * @interface DeclaredName
 */
export interface DeclaredName {
    /** What is declared: one of `DeclarationKind`, or a kind of the dialect (`command`, `event`...). */
    kind: string;
    name: string;
    /** The class or function the name belongs to, when it is a member or a parameter. */
    container?: string;
    /** Where the name starts. */
    start: Location;
    /** Where the name ends: the position right after its last character. */
    end: Location;
}
