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

export type NodeType = 'Clase' | 'Funcion' | 'Bucle' | 'Propiedad' | 'Variable' | 'Condicion' | 'ExpresionBinaria' | 'Literal';

interface BaseNode {
    type: NodeType;
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

export interface ForNode extends BaseNode {
    type: 'Bucle';
    var: string;
    iterable: ASTNode;
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

export type ASTNode = LiteralNode | BinaryExpressionNode | ClassNode | FunctionNode | ConditionNode | ForNode;