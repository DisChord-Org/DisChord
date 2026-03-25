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

export type Token = {
    type: string;
    value: string;
};

export type CoreNodeType<T = never> =
        'Clase' | 'Funcion' | 'Bucle' | 'Propiedad' | 'Variable'
      | 'Condicion' | 'ExpresionBinaria' | 'Literal' | 'Salir'
      | 'Pasar' | 'Devolver' | 'Nuevo' | 'NoUnario' | 'Unario'
      | 'Lista' | 'Expresion' | 'Objeto' | 'Identificador'
      | 'Acceso' | 'Llamada' | 'Exportar' | 'Importar'
      | 'Asignacion' | 'JS' | 'Super' | 'Esta' | 'AccesoPorIndice' | T;

export type NodeType<T = never> = CoreNodeType | T;
export interface BaseNode<T = never> {
    type: NodeType<T>;
};

export interface ClassNode<T = never> extends BaseNode<T> {
    type: 'Clase';
    id: string;
    superClass?: string;
    body: ASTNode<T>[];
}

export interface FunctionNode<T = never> extends BaseNode<T> {
    type: 'Funcion';
    id: string;
    metadata: {
        isConstructor: boolean;
        isStatic?: boolean;
        isMethod?: boolean;
        isAsync?: boolean;
    };
    params: string[];
    body: ASTNode<T>[];
}

export interface LoopNode<T = never> extends BaseNode<T> {
    type: 'Bucle';
    var: string;
    iterable: ASTNode<T>;
    body: ASTNode<T>[];
}

export interface PropertyNode<T = never> extends BaseNode<T> {
    type: 'Propiedad';
    id: string;
    value: ASTNode<T>;
    isStatic?: boolean;
}

export interface VariableNode<T = never> extends BaseNode<T> {
    type: 'Variable';
    id: string;
    value: ASTNode<T>;
    isStatic?: boolean;
}

export interface ConditionNode<T = never> extends BaseNode<T> {
    type: 'Condicion';
    test: ASTNode<T>;
    consequent: ASTNode<T>[];
    alternate?: ASTNode<T>[] | ConditionNode<T>;
}

export interface BinaryExpressionNode<T = never> extends BaseNode<T> {
    type: 'ExpresionBinaria';
    left: ASTNode<T>;
    operator: string;
    right: ASTNode<T>;
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

export interface ReturnNode<T = never> extends BaseNode<T> {
    type: 'Devolver';
    object: ASTNode<T> | undefined;
}

export interface NewNode<T = never> extends BaseNode<T> {
    type: 'Nuevo';
    object: ASTNode<T>;
}

export interface NoUnaryNode<T = never> extends BaseNode<T> {
    type: 'NoUnario';
    operator: string;
    object: ASTNode<T>;
}

export interface UnaryNode<T = never> extends BaseNode<T> {
    type: 'Unario';
    operator: string;
    object: ASTNode<T>;
}

export interface ListNode<T = never> extends BaseNode<T> {
    type: 'Lista';
    body: ASTNode<T>[];
}

export interface ExpressionNode<T = never> extends BaseNode<T> {
    type: 'Expresion';
    object: ASTNode<T>;
}

export interface ObjectProperty<T = never> {
    key: string;
    value: ASTNode<T>;
}

export interface ObjectNode<T = never> extends BaseNode<T> {
    type: 'Objeto';
    properties: ObjectProperty<T>[];
}

export interface IdentificatorNode<T = never> extends BaseNode<T> {
    type: 'Identificador';
    value: string;
}

export interface AccessNode<T = never> extends BaseNode<T> {
    type: 'Acceso';
    object: ASTNode<T>;
    property: string;
}

export interface AccessNodeByIndex<T = never> extends BaseNode<T> {
    type: 'AccesoPorIndice';
    object: ASTNode<T>;
    index: ASTNode<T>;
}

export interface CallNode<T = never> extends BaseNode<T> {
    type: 'Llamada';
    object: ASTNode<T>;
    params: ASTNode<T>[];
}

export interface ExportNode<T = never> extends BaseNode<T> {
    type: 'Exportar';
    object: ASTNode<T>;
}

export interface ImportNode<T = never> extends BaseNode<T> {
    type: 'Importar';
    identificators: string[];
    path: string;
}

export interface AssignmentNode<T = never> extends BaseNode<T> {
    type: 'Asignacion';
    left: ASTNode<T>;
    assignment: ASTNode<T>;
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
    | BinaryExpressionNode<T>
    | ConditionNode<T>
    | VariableNode<T>
    | PropertyNode<T>
    | LoopNode<T>
    | FunctionNode<T>
    | ClassNode<T>
    | ExitLoopNode<T>
    | PassLoopNode<T>
    | ReturnNode<T>
    | NewNode<T>
    | NoUnaryNode<T>
    | UnaryNode<T>
    | ListNode<T>
    | ExpressionNode<T>
    | ObjectNode<T>
    | IdentificatorNode<T>
    | AccessNode<T>
    | CallNode<T>
    | ExportNode<T>
    | ImportNode<T>
    | AssignmentNode<T>
    | JSNode<T>
    | SuperNode<T>
    | ThisNode<T>
    | AccessNodeByIndex<T>
    | N;