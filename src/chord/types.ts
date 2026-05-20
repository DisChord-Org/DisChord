/**
 * @file types.ts
 * @description Core AST node type definitions and generic structural bindings for the DisChord compiler.
 */

export enum SymbolKind {
    Variable,
    Function,
    Class,
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

    // Decorators
    Decorador: 'decorador',

    // Operators
    Mas: 'mas',
    Menos: 'menos',
    Por: 'por',
    Entre: 'entre',
    Punto: 'punto',
    Igual: 'igual',
    IgualTipado: 'igual_tipado',

    // Delimiters
    L_BRACE: 'L_BRACE',     // {
    R_BRACE: 'R_BRACE',     // }
    L_PAREN: 'L_PAREN',     // (
    R_PAREN: 'R_PAREN',     // )
    COMA: 'COMA',

    // Dynamic Literals & Identifiers
    IDENTIFICADOR: 'IDENTIFICADOR',
    NUMERO: 'NUMERO',
    TEXTO: 'TEXTO',
    
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
 * Representation of a lexical token scanned from the source code.
 * @interface Token
 */
export type Token = {
    /** The strictly typed category from the TokenType enum */
    type: TokenType;
    /** The raw textual value string found in the code */
    value: string;
    /** Code coordinates tracking for error generation */
    location: Location;
};

/**
 * Resolves the final comprehensive type classification for any given AST node.
 * @template T - Extensible custom node types injection.
 */
export type NodeType<T> = TokenType | T;

/**
 * Base abstract blueprint for every syntax tree node generated during parsing.
 * @interface BaseNode
 * @template T - Custom token/node type overriding hook.
 */
export interface BaseNode<T> {
    readonly type: NodeType<T>;
    location: Location;
};

export interface ClassNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.Clase;
    id: string;
    superClass?: string;
    body: ASTNode<T, N>[];
}

export interface FunctionNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.Funcion;
    id: string;
    metadata: {
        isConstructor: boolean;
        isStatic?: boolean;
        isMethod?: boolean;
        isAsync?: boolean;
    };
    params: string[];
    body: ASTNode<T, N>[];
}

export interface LoopNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.BUCLE;
    var: string;
    iterable: ASTNode<T, N>;
    body: ASTNode<T, N>[];
}

export interface PropertyNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.PROPIEDAD;
    id: string;
    value: ASTNode<T, N>;
    isStatic?: boolean;
}

export interface VariableNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.VARIABLE;
    id: string;
    value: ASTNode<T, N>;
    isStatic?: boolean;
}

export interface ConditionNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.CONDICION;
    test: ASTNode<T, N>;
    consequent: ASTNode<T, N>[];
    alternate?: ASTNode<T, N>[] | ConditionNode<T, N>;
}

export interface BinaryExpressionNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.EXPRESION_BINARIA;
    left: ASTNode<T, N>;
    operator: string;
    right: ASTNode<T, N>;
}

export interface LiteralNode<T> extends BaseNode<T> {
    type: typeof TokenType.LITERAL;
    value: string | number | boolean | undefined;
    raw: string;
}

export interface ExitLoopNode<T> extends BaseNode<T> {
    type: typeof TokenType.Salir;
}

export interface PassLoopNode<T> extends BaseNode<T> {
    type: typeof TokenType.Pasar;
}

export interface ReturnNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.Devolver;
    object: ASTNode<T, N> | undefined;
}

export interface NewNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.Nuevo;
    object: ASTNode<T, N>;
}

export interface NoUnaryNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.NO_UNARIO;
    operator: string;
    object: ASTNode<T, N>;
}

export interface UnaryNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.NO_UNARIO;
    operator: string;
    object: ASTNode<T, N>;
}

export interface ListNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.LISTA;
    body: ASTNode<T, N>[];
}

export interface ExpressionNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.EXPRESION;
    object: ASTNode<T, N>;
}

export interface IdentificatorNode<T> extends BaseNode<T> {
    type: typeof TokenType.IDENTIFICADOR;
    value: string;
}

export interface AccessNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.ACCESO;
    object: ASTNode<T, N>;
    property: string;
}

export interface AccessNodeByIndex<T, N> extends BaseNode<T> {
    type: typeof TokenType.ACCESO_POR_INDICE;
    object: ASTNode<T, N>;
    index: ASTNode<T, N>;
}

export interface CallNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.LLAMADA;
    object: ASTNode<T, N>;
    params: ASTNode<T, N>[];
}

export interface ExportNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.Exportar;
    object: ASTNode<T, N>;
}

export interface ImportNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.Importar;
    identificators: string[];
    path: string;
    isDestructured: boolean;
}

export interface AssignmentNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.ASIGNACION;
    left: ASTNode<T, N>;
    assignment: ASTNode<T, N>;
}

export interface JSNode<T> extends BaseNode<T> {
    type: typeof TokenType.JS,
    value: string
}

export interface SuperNode<T> extends BaseNode<T> {
    type: typeof TokenType.Super;
    value: '';
}

export interface ThisNode<T> extends BaseNode<T> {
    type: typeof TokenType.Esta;
    value: '';
}

export interface BlockNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.BLOQUE;
    body: ASTNode<T, N>[];
}

export interface EOF<T> extends BaseNode<T> {
    type: typeof TokenType.EOF;
    value: '';
}

export interface SOF<T> extends BaseNode<T> {
    type: typeof TokenType.SOF;
    value: '';
}

export enum ODBMode {
    Simple = 0,
    Intelligent = 1
}

export interface ODBNode<T, N> extends BaseNode<T> {
    type: typeof TokenType.BDO;
    mode: ODBMode;
    blocks: Record<string, ASTNode<T, N>>;
    body: ASTNode<T, N>[];
}

export type ASTNode<T, N> =
      EOF<T>
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
    | ImportNode<T, N>
    | AssignmentNode<T, N>
    | JSNode<T>
    | SuperNode<T>
    | ThisNode<T>
    | AccessNodeByIndex<T, N>
    | ODBNode<T, N>
    | BlockNode<T, N>
    | N;