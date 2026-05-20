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

/**
 * Lexical token payload structure utilized by the Parser.
 * @type {Object} Token
 */
export type Token = {
    type: string;
    value: string;
    location: Location;
};

export enum TokenType {
    // Reserved words
    Var = 'var',
    Es = 'es',
    Funcion = 'funcion',
    Fijar = 'fijar',
    Clase = 'clase',
    Extiende = 'extiende',
    En = 'en',
    Para = 'para',
    Si = 'si',
    Devolver = 'devolver',
    Importar = 'importar',
    Exportar = 'exportar',
    Desde = 'desde',
    Salir = 'salir',
    Pasar = 'pasar',
    Prop = 'prop',
    Nuevo = 'nuevo',
    JS = 'js',
    Super = 'super',
    Esta = 'esta',

    // Decorators
    Decorador = 'decorador',

    // Operators
    Mas = 'mas',
    Menos = 'menos',
    Por = 'por',
    Entre = 'entre',
    Punto = 'punto',
    Igual = 'igual',
    IgualTipado = 'igual_tipado',

    // Delimiters
    L_BRACE = 'L_BRACE',     // {
    R_BRACE = 'R_BRACE',     // }
    L_PAREN = 'L_PAREN',     // (
    R_PAREN = 'R_PAREN',     // )
    COMA = 'COMA',

    // Dynamic Literals & Identifiers
    IDENTIFICADOR = 'IDENTIFICADOR',
    NUMERO = 'NUMERO',
    TEXTO = 'TEXTO',
    
    // System
    EOF = 'EOF',
    SOF = 'SOF'
}

/**
 * Base collection of internal, strictly supported AST node type literal strings.
 * @template T - Extension string literal type union for custom abstraction layers.
 */
export type CoreNodeType<T = string> =
        'Clase' | 'Funcion' | 'Bucle' | 'Propiedad' | 'Variable'
      | 'Condicion' | 'ExpresionBinaria' | 'Literal' | 'Salir'
      | 'Pasar' | 'Devolver' | 'Nuevo' | 'NoUnario' | 'Unario'
      | 'Lista' | 'Expresion' | 'Identificador'
      | 'Acceso' | 'Llamada' | 'Exportar' | 'Importar'
      | 'Asignacion' | 'JS' | 'Super' | 'Esta' | 'AccesoPorIndice'
      | 'BDO' | 'Bloque' | 'EOF' | 'SOF' | T;

/**
 * Resolves the final comprehensive type classification for any given AST node.
 * @template T - Extensible custom node types injection.
 */
export type NodeType<T = never> = CoreNodeType | T;

/**
 * Base abstract blueprint for every syntax tree node generated during parsing.
 * @interface BaseNode
 * @template T - Custom token/node type overriding hook.
 */
export interface BaseNode<T = never> {
    readonly type: NodeType<T>;
    location: Location;
};

export interface ClassNode<T = never, N = never> extends BaseNode<T> {
    type: 'Clase';
    id: string;
    superClass?: string;
    body: ASTNode<T, N>[];
}

export interface FunctionNode<T = never, N = never> extends BaseNode<T> {
    type: 'Funcion';
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

export interface LoopNode<T = never, N = never> extends BaseNode<T> {
    type: 'Bucle';
    var: string;
    iterable: ASTNode<T, N>;
    body: ASTNode<T, N>[];
}

export interface PropertyNode<T = never, N = never> extends BaseNode<T> {
    type: 'Propiedad';
    id: string;
    value: ASTNode<T, N>;
    isStatic?: boolean;
}

export interface VariableNode<T = never, N = never> extends BaseNode<T> {
    type: 'Variable';
    id: string;
    value: ASTNode<T, N>;
    isStatic?: boolean;
}

export interface ConditionNode<T = never, N = never> extends BaseNode<T> {
    type: 'Condicion';
    test: ASTNode<T, N>;
    consequent: ASTNode<T, N>[];
    alternate?: ASTNode<T, N>[] | ConditionNode<T, N>;
}

export interface BinaryExpressionNode<T = never, N = never> extends BaseNode<T> {
    type: 'ExpresionBinaria';
    left: ASTNode<T, N>;
    operator: string;
    right: ASTNode<T, N>;
}

export interface LiteralNode<T = never> extends BaseNode<T> {
    type: 'Literal';
    value: string | number | boolean | undefined;
    raw: string;
}

export interface ExitLoopNode<T = never> extends BaseNode<T> {
    type: 'Salir';
}

export interface PassLoopNode<T = never> extends BaseNode<T> {
    type: 'Pasar';
}

export interface ReturnNode<T = never, N = never> extends BaseNode<T> {
    type: 'Devolver';
    object: ASTNode<T, N> | undefined;
}

export interface NewNode<T = never, N = never> extends BaseNode<T> {
    type: 'Nuevo';
    object: ASTNode<T, N>;
}

export interface NoUnaryNode<T = never, N = never> extends BaseNode<T> {
    type: 'NoUnario';
    operator: string;
    object: ASTNode<T, N>;
}

export interface UnaryNode<T = never, N = never> extends BaseNode<T> {
    type: 'Unario';
    operator: string;
    object: ASTNode<T, N>;
}

export interface ListNode<T = never, N = never> extends BaseNode<T> {
    type: 'Lista';
    body: ASTNode<T, N>[];
}

export interface ExpressionNode<T = never, N = never> extends BaseNode<T> {
    type: 'Expresion';
    object: ASTNode<T, N>;
}

export interface IdentificatorNode<T = never> extends BaseNode<T> {
    type: 'Identificador';
    value: string;
}

export interface AccessNode<T = never, N = never> extends BaseNode<T> {
    type: 'Acceso';
    object: ASTNode<T, N>;
    property: string;
}

export interface AccessNodeByIndex<T = never, N = never> extends BaseNode<T> {
    type: 'AccesoPorIndice';
    object: ASTNode<T, N>;
    index: ASTNode<T, N>;
}

export interface CallNode<T = never, N = never> extends BaseNode<T> {
    type: 'Llamada';
    object: ASTNode<T, N>;
    params: ASTNode<T, N>[];
}

export interface ExportNode<T = never, N = never> extends BaseNode<T> {
    type: 'Exportar';
    object: ASTNode<T, N>;
}

export interface ImportNode<T = never, N = never> extends BaseNode<T> {
    type: 'Importar';
    identificators: string[];
    path: string;
    isDestructured: boolean;
}

export interface AssignmentNode<T = never, N = never> extends BaseNode<T> {
    type: 'Asignacion';
    left: ASTNode<T, N>;
    assignment: ASTNode<T, N>;
}

export interface JSNode<T = never> extends BaseNode<T> {
    type: 'JS',
    value: string
}

export interface SuperNode<T = never> extends BaseNode<T> {
    type: 'Super';
    value: 'super';
}

export interface ThisNode<T = never> extends BaseNode<T> {
    type: 'Esta';
    value: 'this';
}

export interface BlockNode<T, N> extends BaseNode<T> {
    type: 'Bloque';
    body: ASTNode<T, N>[];
}

export interface EOF<T = never> extends BaseNode<T> {
    type: 'EOF';
    value: '';
}

export interface SOF<T = never> extends BaseNode<T> {
    type: 'SOF';
    value: '';
}

export enum ODBMode {
    Simple = 0,
    Intelligent = 1
}

export interface ODBNode<T = never, N = never> extends BaseNode<T> {
    type: 'BDO';
    mode: ODBMode;
    blocks: Record<string, ASTNode<T, N>>;
    body: ASTNode<T, N>[];
}

export type ASTNode<T = never, N = never> =
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