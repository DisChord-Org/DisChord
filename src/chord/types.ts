/**
 * @file types.ts
 * @description Core AST node type definitions and generic structural bindings for the DisChord compiler.
 */

/**
 * Valid variant token lookup strategies allowed within the parser stream inspection pipeline.
 * Supports relative numerical index offsets or explicit descriptive semantic aliases.
 * @typedef {number | 'this' | 'next' | 'prev'} PeekType
 */
export type PeekType = number | 'this' | 'next' | 'prev';

/**
 * Defines the operational categories of symbols encountered during semantic analysis.
 * Used by the Symbol Table to differentiate identifiers and enforce type-checking boundaries.
 * @enum {number}
 */
export enum SymbolKind {
    /** Represents a mutable or immutable variable allocation binding. */
    Variable,
    
    /** Represents a reusable routine block declaration with scoped parameters. */
    Function,
    
    /** Represents an object-oriented structural blueprint definition wrapper. */
    Class,
    
    /** Represents an isolated state field or member attribute locked inside a Class context. */
    Property
};

/**
 * Represents an entry in the compiler's Symbol Table.
 * @interface Symbol
 */
export interface Symbol {
    /** The identifier name of the symbol */
    name: string;
    /** The structural category of the symbol */
    kind: SymbolKind;
    /** Compile-time flags and metadata modifier properties */
    metadata: {
        isAsync?: boolean;
        isExported?: boolean;
        isStatic?: boolean;
    };
};

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
    Indefinido: 'indefinido',

    // Decorators
    Decorador: 'decorador',

    // Operators
    Intro: 'intro',
    Espacio: 'espacio',
    Mas: 'mas',
    Menos: 'menos',
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
    /** Code coordinates tracking for error generation */
    location: Location;
};

/**
 * Resolves the final comprehensive type classification for any given AST node.
 * @template T - Extensible custom node types injection.
 */
export type NodeType<T extends string> = TokenType | T;

/**
 * Base abstract blueprint for every syntax tree node generated during parsing.
 * @interface BaseNode
 * @template T - Custom token/node type overriding hook.
 */
export interface BaseNode<T extends string> {
    /** Strictly typed structural classifier matching the Registry or extensions */
    readonly type: NodeType<T>;
    /** Code coordinates tracking for execution errors */
    location: Location;
};

/**
 * Syntax node representing an object-oriented class declaration.
 * @interface ClassNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ClassNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Clase;
    /** The identifier naming the declared class */
    id: string;
    /** Optional parent class identifier name being inherited */
    superClass?: string;
    /** Nested collection of body nodes evaluated inside the class block scope */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node representing a routine or method declaration.
 * @interface FunctionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface FunctionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Funcion;
    /** The identifier naming the routine */
    id: string;
    /** Routine compilation flags and structural modifiers */
    metadata: {
        isConstructor: boolean;
        isStatic?: boolean;
        isMethod?: boolean;
        isAsync?: boolean;
    };
    /** Parameter identifier names requested by the signature */
    params: string[];
    /** Internal execution statements body */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node representing a collection iteration loop construct.
 * @interface LoopNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface LoopNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.BUCLE;
    /** The iteration variable bound locally to the loop block */
    var: string;
    /** The underlying collection target structure being iterated */
    iterable: ASTNode<T, N>;
    /** Loop body execution tree statements */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node representing a field configuration descriptor inside an entity scope.
 * @interface PropertyNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface PropertyNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.PROPIEDAD;
    /** Property identification descriptor name */
    id: string;
    /** Assigned instantiation expression node value */
    value: ASTNode<T, N>;
    /** Indicates if the property belongs statically to the parent namespace */
    isStatic?: boolean;
}

/**
 * Syntax node representing a data location variable assignment.
 * @interface VariableNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface VariableNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.VARIABLE;
    /** Allocated local tracking identifier */
    id: string;
    /** Assigned initializer expression structural evaluation tree */
    value: ASTNode<T, N>;
    /** Meta flag tracking class-bound context availability scopes */
    isStatic?: boolean;
}

/**
 * Syntax node representing logical bifurcations in execution paths.
 * @interface ConditionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ConditionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.CONDICION;
    /** Analytical predicate boolean testing block */
    test: ASTNode<T, N>;
    /** Consequent execution path if the testing criteria resolves positive */
    consequent: ASTNode<T, N>[];
    /** Alternative alternate sequence block path or stacked subconditions */
    alternate?: ASTNode<T, N>[] | ConditionNode<T, N>;
}

/**
 * Syntax node processing expressions utilizing left and right structures connected by infix operators.
 * @interface BinaryExpressionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface BinaryExpressionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.EXPRESION_BINARIA;
    /** Left side child member expression tree node */
    left: ASTNode<T, N>;
    /** Raw mathematical/logical token string connecting the expression */
    operator: string;
    /** Right side child member expression tree node */
    right: ASTNode<T, N>;
}

/**
 * Syntax node hosting primitive absolute data values.
 * @interface LiteralNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface LiteralNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.LITERAL;
    /** Evaluated primitive script host value representation */
    value: string | number | boolean | undefined;
    /** Exact source textual literal matching token reference */
    raw: string;
}

/**
 * Syntax node representing short-circuit termination directives in active looping frames.
 * @interface ExitLoopNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface ExitLoopNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Salir;
}

/**
 * Syntax node representing quick shortcut skip updates inside iteration loops frames.
 * @interface PassLoopNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface PassLoopNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Pasar;
}

/**
 * Syntax node commanding stack extraction routine value reflections back to initial frame callers.
 * @interface ReturnNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ReturnNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Devolver;
    /** Reflected tracking expression structure target value, if any */
    object: ASTNode<T, N> | undefined;
}

/**
 * Syntax node controlling entity object creation allocations via initialization instantiation calls.
 * @interface NewNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface NewNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Nuevo;
    /** Structural constructor object targeting execution instantiation */
    object: ASTNode<T, N>;
}

/**
 * Syntax node representing a negative logical operation.
 * @interface NoUnaryNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface NoUnaryNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.NO_UNARIO;
    /** Applied operational tracking character operator */
    operator: string;
    /** Evaluated target expression being negated */
    object: ASTNode<T, N>;
}

/**
 * Syntax node executing classic standalone operational modifiers against an expression target.
 * @interface UnaryNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface UnaryNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.UNARIO;
    /** Applied structural character operator */
    operator: string;
    /** Targeted target expression subject */
    object: ASTNode<T, N>;
}

/**
 * Syntax node defining an ordered list or array data collection expression.
 * @interface ListNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ListNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.LISTA;
    /** Ordered compilation tracking child nodes embedded within the list context */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node grouping an isolated operation block wrapping context expressions.
 * @interface ExpressionNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ExpressionNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.EXPRESION;
    /** Wrapped inner targeted execution node reference */
    object: ASTNode<T, N>;
}

/**
 * Syntax node binding a unique identifier string name value representing an operational reference symbol.
 * @interface IdentificatorNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface IdentificatorNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.IDENTIFICADOR;
    /** The literal value name string of the identifier */
    value: string;
}

/**
 * Syntax node reading properties inside an object data structure layout.
 * @interface AccessNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface AccessNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.ACCESO;
    /** Object structural element containing target properties */
    object: ASTNode<T, N>;
    /** Selected tracking string field identifier name being queried */
    property: string;
}

/**
 * Syntax node reading values dynamically out of an array or map data map via bracket index references.
 * @interface AccessNodeByIndex
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface AccessNodeByIndex<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.ACCESO_POR_INDICE;
    /** Targeted index collection object element */
    object: ASTNode<T, N>;
    /** Index target evaluation structural selector expression */
    index: ASTNode<T, N>;
}

/**
 * Syntax node triggering method/routine operations payload evaluation bindings passing sequential argument nodes.
 * @interface CallNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface CallNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.LLAMADA;
    /** Targeted execution function routine element */
    object: ASTNode<T, N>;
    /** Injected sequential parameter arguments list expressions */
    params: ASTNode<T, N>[];
}

/**
 * Syntax node handling external component tracking exports deployment blocks.
 * @interface ExportNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ExportNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.Exportar;
    /** Nested reference target block node designated for module system exports */
    object: ASTNode<T, N>;
}

/**
 * Syntax node fetching references extracted out of structural modular package resources paths.
 * @interface ImportNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ImportNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Importar;
    /** Target symbol string identifier arrays requested into internal scope names spaces */
    identificators: string[];
    /** Relative system string path location mapping package target files layout */
    path: string;
    /** Specifies whether the module inclusion strategy applies destructuring patterns */
    isDestructured: boolean;
}

/**
 * Syntax node evaluating assignment mutations binding left targets to updated value states.
 * @interface AssignmentNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface AssignmentNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.ASIGNACION;
    /** Subject targeted tracking element receiver expression node */
    left: ASTNode<T, N>;
    /** Source computation structure evaluation supplying incoming replacement states data */
    assignment: ASTNode<T, N>;
}

/**
 * Syntax node bypassing standard analysis injected raw output scripts down stream pipelines directly.
 * @interface JSNode
 * @template {string} T - Token extensions vector.
 */
export interface JSNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.JS,
    /** Inline execution runtime string script payload text content */
    value: string;
}

/**
 * Syntax node injecting parent object scoping access lookup pointers inside class environments.
 * @interface SuperNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface SuperNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Super;
    value: '';
}

/**
 * Syntax node tracking self instance runtime context references pointers mapping current scopes environments.
 * @interface ThisNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface ThisNode<T extends string> extends BaseNode<T> {
    type: typeof TokenType.Esta;
    value: '';
}

/**
 * Syntax node organizing sequences of expressions isolated inside unique block scopes namespaces limits.
 * @interface BlockNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface BlockNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.BLOQUE;
    /** Internal execution statements tree data sequential nodes array list */
    body: ASTNode<T, N>[];
}

/**
 * Syntax node capturing End Of File markers signaling lexical boundary terminal completions points.
 * @interface EOF
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface EOF<T extends string> extends BaseNode<T> {
    type: typeof TokenType.EOF;
    value: '';
}

/**
 * Syntax node capturing Start Of File tracking triggers ensuring early system environment setups configurations.
 * @interface SOF
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 */
export interface SOF<T extends string> extends BaseNode<T> {
    type: typeof TokenType.SOF;
    value: '';
}

/**
 * Execution strategy modifiers configuration settings mapping ODB structural optimization steps.
 * @enum {number}
 */
export enum ODBMode {
    Simple = 0,
    Intelligent = 1
}

/**
 * Syntax node controlling declarative database object processing abstractions configurations layouts.
 * @interface ODBNode
 * @extends BaseNode<T>
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export interface ODBNode<T extends string, N extends BaseNode<T>> extends BaseNode<T> {
    type: typeof TokenType.BDO;
    /** Target optimization execution configuration strategy layer choice mode setting */
    mode: ODBMode;
    /** Record map dictionary pairing configuration namespace string keys onto evaluation expression trees nodes */
    blocks: Record<string, ASTNode<T, N>>;
    /** Array containing procedural statements bound to the target space setup context */
    body: ASTNode<T, N>[];
}

/**
 * Comprehensive polymorphic union encompassing all valid compilation nodes available inside the Abstract Syntax Tree.
 * @template {string} T - Extensible custom token type bindings vector mapping custom plugins requirements.
 * @template {BaseNode<T>} N - Extensible custom node interface structures injection hooked into higher compiler levels.
 */
export type ASTNode<T extends string, N extends BaseNode<T>> =
    | EOF<T>
    | SOF<T>
    | LiteralNode<T>
    | BinaryExpressionNode<T, N>
    | ConditionNode<T, N>
    | VariableNode<T, N>
    | PropertyNode<T, N>
    | LoopNode<T, N>
    | FunctionNode<T, N>
    | ClassNode<T, N>
    | ExitLoopNode<T>
    | PassLoopNode<T>
    | ReturnNode<T, N>
    | NewNode<T, N>
    | NoUnaryNode<T, N>
    | UnaryNode<T, N>
    | ListNode<T, N>
    | ExpressionNode<T, N>
    | IdentificatorNode<T>
    | AccessNode<T, N>
    | CallNode<T, N>
    | ExportNode<T, N>
    | ImportNode<T>
    | AssignmentNode<T, N>
    | JSNode<T>
    | SuperNode<T>
    | ThisNode<T>
    | AccessNodeByIndex<T, N>
    | ODBNode<T, N>
    | BlockNode<T, N>
    | N;