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

export type NodeType<T = never> = 'Clase' | 'Funcion' | 'Bucle' | 'Propiedad' | 'Variable'
                    | 'Condicion' | 'ExpresionBinaria' | 'Literal' | 'Salir'
                    | 'Pasar' | 'Devolver' | 'Nuevo' | 'NoUnario' | 'Unario'
                    | 'Lista' | 'Expresion' | 'Objeto' | 'Identificador'
                    | 'Acceso' | 'Llamada' | 'Exportar' | 'Importar'
                    | 'Asignacion' | 'JS' | 'Super' | 'Esta' | T;

export interface BaseNode<T = never> {
    type: NodeType<T>;
};

export interface ClassNode extends BaseNode {
    type: 'Clase';
    id: string;
    superClass?: string;
    body: ASTNode[];
}

export interface FunctionNode extends BaseNode {
    type: 'Funcion';
    id: string;
    metadata: {
        isConstructor: boolean;
        isStatic?: boolean;
        isMethod?: boolean;
        isAsync?: boolean;
    };
    params: string[];
    body: ASTNode[];
}

export interface LoopNode extends BaseNode {
    type: 'Bucle';
    var: string;
    iterable: ASTNode;
    body: ASTNode[];
}

export interface PropertyNode extends BaseNode {
    type: 'Propiedad';
    id: string;
    value: ASTNode;
    isStatic?: boolean;
}

export interface VariableNode extends BaseNode {
    type: 'Variable';
    id: string;
    value: ASTNode;
    isStatic?: boolean;
}

export interface ConditionNode extends BaseNode {
    type: 'Condicion';
    test: ASTNode;
    consequent: ASTNode[];
    alternate?: ASTNode[] | ConditionNode;
}

export interface BinaryExpressionNode extends BaseNode {
    type: 'ExpresionBinaria';
    left: ASTNode;
    operator: string;
    right: ASTNode;
}

export interface LiteralNode extends BaseNode {
    type: 'Literal';
    value: string | number | boolean | undefined | ASTNode;
    raw: string;
}

export interface ExitLoopNode extends BaseNode {
    type: 'Salir';
}

export interface PassLoopNode extends BaseNode {
    type: 'Pasar';
}

export interface ReturnNode extends BaseNode {
    type: 'Devolver';
    object: ASTNode | undefined;
}

export interface NewNode extends BaseNode {
    type: 'Nuevo';
    object: ASTNode;
}

export interface NoUnaryNode extends BaseNode {
    type: 'NoUnario';
    operator: string;
    object: ASTNode;
}

export interface UnaryNode extends BaseNode {
    type: 'Unario';
    operator: string;
    object: ASTNode;
}

export interface ListNode extends BaseNode {
    type: 'Lista';
    body: ASTNode[];
}

export interface ExpressionNode extends BaseNode {
    type: 'Expresion';
    object: ASTNode;
}

export type ObjectPropertyType = Record<'key', string> & Record<'value', ASTNode>;
export interface ObjectNode extends BaseNode {
    type: 'Objeto';
    properties: ObjectPropertyType[];
}

export interface IdentificatorNode extends BaseNode {
    type: 'Identificador';
    value: string;
}

export interface AccessNode extends BaseNode {
    type: 'Acceso';
    object: ASTNode;
    property: string;
}

export interface CallNode extends BaseNode {
    type: 'Llamada';
    object: IdentificatorNode | NewNode | ThisNode | SuperNode | AccessNode;
    params: ASTNode[];
}

export interface ExportNode extends BaseNode {
    type: 'Exportar';
    object: ASTNode;
}

export interface ImportNode extends BaseNode {
    type: 'Importar';
    identificators: string[];
    path: string;
}

export interface AssignmentNode extends BaseNode {
    type: 'Asignacion';
    left: ASTNode;
    assignment: ASTNode;
}

export interface JSNode extends BaseNode {
    type: 'JS',
    value: string
}

export interface SuperNode extends BaseNode {
    type: 'Super';
    value: 'super';
}

export interface ThisNode extends BaseNode {
    type: 'Esta';
    value: 'this';
}

export type ASTNode<T = never, N = never> = LiteralNode | BinaryExpressionNode | ConditionNode
                    | VariableNode | PropertyNode | LoopNode | FunctionNode
                    | ClassNode | ExitLoopNode | PassLoopNode | ReturnNode
                    | NewNode | NoUnaryNode | UnaryNode | ListNode
                    | ExpressionNode | ObjectNode | IdentificatorNode
                    | AccessNode | CallNode | ExportNode | ImportNode
                    | AssignmentNode | JSNode | SuperNode | ThisNode | N;