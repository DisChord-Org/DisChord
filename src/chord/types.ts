export interface Symbol { // para la tabla de símbolos
    name: string;
    type: 'var' | 'func' | 'class' | 'prop';
    isAsync?: boolean;
    isExported?: boolean;
    scope: 'global' | 'local';
}

export type Token = {
    type: string;
    value: string;
};

export type ASTNode = {
    type: string;
    value?: string | number | boolean | undefined;
    raw?: string;
    children?: ASTNode[];
    object?: ASTNode;
    property?: string;
    left?: ASTNode;
    operator?: string;
    right?: ASTNode;
};

export interface ClassNode extends ASTNode {
    type: 'CLASE';
    id: string;
    superClass?: string;
    body: ASTNode[];
}

export interface FunctionNode extends ASTNode {
    type: 'FUNCION';
    id: string;
    isConstructor: boolean;
    isStatic?: boolean;
    isMethod?: boolean;
    isAsync?: boolean;
    params: string[];
    body: ASTNode[];
}

export interface PropertyNode extends ASTNode {
    type: 'PROPIEDAD';
    id: string;
    prop_value: ASTNode;
    isStatic?: boolean;
}

export interface VarNode extends ASTNode {
    type: 'VAR';
    id: string;
    prop_value: ASTNode;
    isStatic?: boolean;
}

export interface ConditionNode extends ASTNode {
    type: 'CONDICION';
    test: ASTNode;
    consequent: ASTNode[];
    alternate?: ASTNode[] | ConditionNode;
}

export interface ForNode extends ASTNode {
    type: 'BUCLE';
    var: string;
    iterable: ASTNode;
}