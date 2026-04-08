export enum SymbolKind {
    Variable,
    Function,
    Class,
    Property
}

export interface Symbol { // symbols table
    name: string;
    kind: SymbolKind;
    metadata: {
        isAsync?: boolean;
        isExported?: boolean;
        isStatic?: boolean;
    };
}

export type Location = {
    line: number;
    column: number;
};

export type Token = {
    type: string;
    value: string;
    location: Location;
};

export type CoreNodeType<T = string> =
        'Clase' | 'Funcion' | 'Bucle' | 'Propiedad' | 'Variable'
      | 'Condicion' | 'ExpresionBinaria' | 'Literal' | 'Salir'
      | 'Pasar' | 'Devolver' | 'Nuevo' | 'NoUnario' | 'Unario'
      | 'Lista' | 'Expresion' | 'Objeto' | 'Identificador'
      | 'Acceso' | 'Llamada' | 'Exportar' | 'Importar'
      | 'Asignacion' | 'JS' | 'Super' | 'Esta' | 'AccesoPorIndice' | T;

export type NodeType<T = never> = CoreNodeType | T;

export interface BaseNode<T = never> {
    readonly type: NodeType<T>;
    location?: Location;
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

export interface ObjectProperty<T = never, N = never> {
    key: string;
    value: ASTNode<T, N>;
}

export interface ObjectNode<T = never, N = never> extends BaseNode<T> {
    type: 'Objeto';
    properties: ObjectProperty<T, N>[];
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

export type ASTNode<T = never, N = never> =
      LiteralNode<T>
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
    | ObjectNode<T>
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
    | N;