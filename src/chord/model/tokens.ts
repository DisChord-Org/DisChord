/**
 * @file tokens.ts
 * @description The vocabulary of the lexer and the parser: token types, the closed registries of names the language knows (primitive types, decorators, named texts, syntax functions), the operator groups, and what a token is.
 */


/**
 * Valid variant token lookup strategies allowed within the parser stream inspection pipeline.
 * Supports relative numerical index offsets or explicit descriptive semantic aliases.
 * @typedef {number | 'this' | 'next' | 'prev'} PeekType
 */
export type PeekType = number | 'this' | 'next' | 'prev';

/**
 * Decorators the language knows, by the name the `DecoratorProcessor` keeps them under. The
 * lexer tokenizes any `@word`; only these have a meaning.
 * @type {const}
 */
export const Decorator = {
    asincrono: '@asincrono',
    BDOI: '@BDOI',
    fijar: '@fijar'
} as const;

/**
 * Words that stand for a text the lexer produces itself (`espacio` is `" "`, `intro` is a line
 * break), so they are literals and not identifiers or reserved words of the keyword registry.
 * @type {const}
 */
export const NamedTextLiteral = {
    espacio: ' ',
    intro: '\n'
} as const;

/**
 * Calls the compiler resolves by their shape instead of by a definition: they look like a call to
 * a function but are syntax, so no table of functions has them.
 * @type {const}
 */
export const SyntaxFunction = {
    Rango: 'rango'
} as const;

/**
 * Registry of every primitive type name DisChord's compile-time type system currently recognizes,
 * in Spanish, for a `var` declaration's `dataType` — either written explicitly after `tipo`
 * (`TypeAnnotationParser`) or inferred from a literal initializer's native JS type
 * (`LiteralInferrer`, via `TypeInferrer`). Also the closed vocabulary the runtime `tipo x` unary operator
 * (`UnaryVisitor`) translates a JS `typeof` result into. Named exactly like `TokenType` above (a
 * `const` registry plus a type extracting its values) instead of writing the bare Spanish words
 * inline wherever they're needed, for the same reason `TokenType.Var` is preferred over a raw
 * `'var'` literal: a typo in `PrimitiveType.Texto` is a compiler error, a typo in a raw `'texto'`
 * string is a silent runtime mismatch.
 * @type {const}
 */
export const PrimitiveType = {
    Texto: 'texto',
    Numero: 'numero',
    Booleano: 'booleano',
    BDO: 'bdo',
    Indefinido: 'indefinido'
} as const;

/**
 * Unified type extracting values from the `PrimitiveType` constant registry. Every consumer that
 * needs the full set of primitive names (`TypeAnnotationParser.primitiveTypeNames`) or a mapping
 * keyed by them (`PrimitiveDataType.typeofMap`, in `DataType.ts`) is typed against this union, so
 * adding or renaming a primitive here is a compiler error anywhere a table is missing an entry —
 * not a silent runtime mismatch.
 */
export type PrimitiveTypeName = typeof PrimitiveType[keyof typeof PrimitiveType];

/**
 * Tracking coordinates for source code references.
 * @type {Object} Location
 */
export type Location = {
    line: number;
    column: number;
};

/**
 * Registry of all lexical tokens and virtual parser nodes within the Chord infrastructure.
 * Grouped logically to separate raw stream definitions from abstract syntax structures.
 * @type {const}
 */
export const TokenType = {
    // Reserved words
    Var: 'var',
    Es: 'es',
    Funcion: 'funcion',
    Fijar: 'fijar',
    Clase: 'clase',
    Extiende: 'extiende',
    En: 'en',
    Para: 'para',
    Si: 'si',
    Ademas: 'ademas',
    Sino: 'sino',
    Devolver: 'devolver',
    Importar: 'importar',
    Exportar: 'exportar',
    Desde: 'desde',
    Salir: 'salir',
    Pasar: 'pasar',
    Prop: 'prop',
    Nuevo: 'nuevo',
    JS: 'js',
    Super: 'super',
    Esta: 'esta',

    // Reserver keywords as primitive literal types
    Verdadero: 'verdadero',
    Falso: 'falso',
    Indefinido: PrimitiveType.Indefinido,

    // Decorators
    Decorador: 'decorador',

    // Operators
    Mas: 'mas',
    Menos: 'menos',
    Flecha: 'flecha',
    Por: 'por',
    Entre: 'entre',
    Punto: 'punto',
    Exponente: 'exp',
    Resto: 'resto',
    Igual: 'igual',
    IgualTipado: 'igual_tipado',
    Mayor: 'mayor',
    Menor: 'menor',
    MayorIgual: 'mayor_igual',
    MenorIgual: 'menor_igual',
    NoIgual: 'no_igual',
    NoIgualTipado: 'no_igual_tipado',
    Y: 'y',
    O: 'o',
    No: 'no',

    // Delimiters
    L_BRACE: 'L_BRACE',     // {
    R_BRACE: 'R_BRACE',     // }
    L_PAREN: 'L_PAREN',     // (
    R_PAREN: 'R_PAREN',     // )
    L_SQUARE: 'L_SQUARE',   // [
    R_SQUARE: 'R_SQUARE',   // ]
    COMA: 'COMA',
    DOS_PUNTOS: 'DOS_PUNTOS',
    SEPARADOR: 'SEPARADOR',
    PIPE: 'PIPE',   // | (type union separator, e.g. `tipo (texto|numero)`)

    // Dynamic Literals & Identifiers
    IDENTIFICADOR: 'IDENTIFICADOR',
    BOOLEANO: 'BOOLEANO',
    NUMERO: 'NUMERO',
    BIGINT: 'BIGINT',
    TEXTO: 'TEXTO',
    TIPO: 'TIPO',
    
    // System
    EOF: 'EOF',
    SOF: 'SOF',

    /*
        AST Syntactic Nodes
        (Virtual structures created by the Parser)
    */
    BUCLE: 'Bucle',
    PROPIEDAD: 'Propiedad',
    VARIABLE: 'Variable',
    CONDICION: 'Condicion',
    EXPRESION_BINARIA: 'ExpresionBinaria',
    LITERAL: 'Literal',
    NO_UNARIO: 'NoUnario',
    UNARIO: 'Unario',
    LISTA: 'Lista',
    EXPRESION: 'Expresion',
    IDENTIFICADOR_NODO: 'Identificador',
    ACCESO: 'Acceso',
    ACCESO_POR_INDICE: 'AccesoPorIndice',
    LLAMADA: 'Llamada',
    ASIGNACION: 'Asignacion',
    BLOQUE: 'Bloque',
    BDO: 'BDO'
} as const;

/**
 * Unified type extracting values from the TokenType constant registry.
 */
export type TokenType = typeof TokenType[keyof typeof TokenType];

/**
 * The operators `ArithmeticParser` parses (the higher-precedence arithmetic level, above `AditiveParser`'s
 * `mas`/`menos`).
 * @type {const}
 */
export const MultiplicativeOperators: TokenType[] = [
    TokenType.Por, TokenType.Entre, TokenType.Resto, TokenType.Exponente
] as const;

/**
 * Every binary operator that always produces a JS `number` result regardless of its operands'
 * types — even `"a" - 1` is `NaN`, and `typeof NaN === 'number'` — so `BinaryExpressionInferrer` can
 * infer `numero` for them unconditionally. `mas` (`+`) is deliberately excluded: it concatenates into
 * a string when either operand is one, so it needs operand-aware handling.
 * @type {const}
 */
export const NumericOperators: TokenType[] = [ TokenType.Menos, ...MultiplicativeOperators ] as const;

/**
 * Every binary operator `ComparisionParser` parses — and, since comparison always coerces to
 * `true`/`false`, every one `BinaryExpressionInferrer` infers as `booleano` unconditionally. `y`/`o`
 * (`&&`/`||`) aren't here: JS's short-circuit evaluation returns whichever operand decided the
 * result, not necessarily a boolean.
 * @type {const}
 */
export const ComparisonOperators: TokenType[] = [
    TokenType.Mayor, TokenType.Menor, TokenType.MayorIgual, TokenType.MenorIgual,
    TokenType.Igual, TokenType.IgualTipado, TokenType.NoIgual, TokenType.NoIgualTipado
] as const;

/**
 * Every binary operator: the additive, numeric, comparison and logical ones. After a word they make an
 * expression, so a parser that has to tell an expression from a `clave valor` pair can ask here.
 * @type {const}
 */
export const BinaryOperators: TokenType[] = [
    TokenType.Mas, ...NumericOperators, ...ComparisonOperators, TokenType.Y, TokenType.O
] as const;

/**
 * The value tokens `LiteralParser` consumes, and `PrimaryParser` checks to decide to delegate to it.
 * @type {const}
 */
export const LiteralTokens: TokenType[] = [
    TokenType.NUMERO, TokenType.BIGINT, TokenType.BOOLEANO, TokenType.TEXTO, TokenType.Indefinido
] as const;

/**
 * Comprehensive union type for all valid token categories, including parser-generated virtual nodes.
 * @template {string} T - Extensible custom token type bindings vector.
 */
export type TokenTypeUnion<T extends string> = T | TokenType | typeof TokenType.EOF | typeof TokenType.SOF;

/**
 * Representation of a lexical token scanned from the source code.
 * @interface Token
 */
export type Token <T extends string> = {
    /** The strictly typed category from the TokenType enum */
    type: TokenTypeUnion<T>;
    /** The raw textual value string found in the code */
    value: string;
    /** Code coordinates tracking for error generation: where the token starts */
    location: Location;
    /** Where the token ends: the position right after its last character */
    end: Location;
    /** Present, and `true`, when an empty line (no characters, no comment) precedes the token. It
     * is what separates the properties of a block from its code. */
    blankLineBefore?: true;
    /** Present, and `true`, on a token the lexer invented and that is not in the source: the
     * parentheses and `mas` that an interpolated text is rewritten to, and the empty text that opens it. */
    synthetic?: true;
};
