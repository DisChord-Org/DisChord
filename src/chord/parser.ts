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
            
            if (nextToken.type === 'FUNCION') {
                const func = this.parseFunctionDeclaration(false, true);
                func.metadata.isStatic = true;
                return func;
            }
        }

        if (classContext && token.type === 'IDENTIFICADOR' && token.value === classContext) {
            if (this.cursor + 1 < this.tokens.length && this.tokens[this.cursor + 1].type === 'L_EXPRESSION') {
                return this.parseFunctionDeclaration(true);
            }
        }

        return this.parseExpression();
    }
}