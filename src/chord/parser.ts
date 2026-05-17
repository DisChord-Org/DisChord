import { ASTNode, ClassNode, PropertyNode, Token, SymbolKind, ExportNode, ImportNode, ExitLoopNode, PassLoopNode, LiteralNode } from "./types";

class Parser<T = never, N = never> {
    public nodes: ASTNode<T, N>[] = [];

    constructor(
        private tokens: Token[]
    ) {}

    parseStatement(classContext?: string): ASTNode<T, N> {
        if (token.type === 'FIJAR') {
            this.consume('FIJAR');
            const nextToken = this.peek();
            
            if (nextToken.type === 'PROP') {
                const prop = this.parseProperty();
                prop.isStatic = true;
                return prop;
            }
        }
    }
}