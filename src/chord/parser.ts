import { ASTNode, ClassNode, PropertyNode, Token, SymbolKind, ExportNode, ImportNode, ExitLoopNode, PassLoopNode, LiteralNode } from "./types";

class Parser<T = never, N = never> {
    public nodes: ASTNode<T, N>[] = [];

    constructor(
        private tokens: Token[]
    ) {}

    parseStatement(classContext?: string): ASTNode<T, N> {
        if (token.type === 'CLASE') {
            return this.parseClassDeclaration();
        }

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

        if (token.type === 'SALIR') {
            this.consume('SALIR');
            return this.createNode<ExitLoopNode<T>>({ type: 'Salir' });
        }

        if (token.type === 'PASAR') {
            this.consume('PASAR');
            return this.createNode<PassLoopNode<T>>({ type: 'Pasar' });
        }

        if (classContext && token.type === 'IDENTIFICADOR' && token.value === classContext) {
            if (this.cursor + 1 < this.tokens.length && this.tokens[this.cursor + 1].type === 'L_EXPRESSION') {
                return this.parseFunctionDeclaration(true);
            }
        }

        return this.parseExpression();
    }

    private parseClassDeclaration(): ClassNode<T, N> {
        this.consume('CLASE');
        
        const id = this.consume('IDENTIFICADOR', 'Se debe especificar el nombre de la clase').value;
        
        let superClass = undefined;
        if (this.cursor < this.tokens.length && this.peek().type === 'EXTIENDE') {
            this.consume('EXTIENDE');
            superClass = this.consume('IDENTIFICADOR', `Se debe especificar el nombre de la clase padre`).value;
        }

        this.consume('L_BRACE', `Al declarar una clase debes usar '{'.`);

        const body: ASTNode<T, N>[] = [];
        while (this.peek().type !== 'R_BRACE') {
            body.push(this.parseStatement(id));
        }

        this.consume('R_BRACE');

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Class
        });

        return this.createNode<ClassNode<T, N>>({
            type: 'Clase',
            id,
            superClass,
            body
        });
    }
}