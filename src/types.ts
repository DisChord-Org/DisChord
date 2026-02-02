export type Token = {
    type: string;
    value: string;
};

export type ASTNode = {
    type: string;
    value?: string | number;
    raw?: string;
    children?: ASTNode[];
    object?: ASTNode;
    property?: string;
};