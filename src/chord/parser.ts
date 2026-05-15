import { ASTNode, ClassNode, PropertyNode, Token, SymbolKind, ExportNode, ImportNode, ExitLoopNode, PassLoopNode, LiteralNode } from "./types";

class Parser<T = never, N = never> {
    public nodes: ASTNode<T, N>[] = [];

    constructor(
        private tokens: Token[],
        private current: number = 0
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

        if (token.type === 'PROP') {
            return this.parseProperty();
        }

        if (token.type === 'SALIR') {
            this.consume('SALIR');
            return this.createNode<ExitLoopNode<T>>({ type: 'Salir' });
        }

        if (token.type === 'PASAR') {
            this.consume('PASAR');
            return this.createNode<PassLoopNode<T>>({ type: 'Pasar' });
        }

        if (token.type === 'EXPORTAR') {
            this.consume('EXPORTAR');
            const declaration = this.parseStatement();
            
            return this.createNode<ExportNode<T, N>>({
                type: 'Exportar',
                object: declaration
            });
        }

        if (token.type === 'IMPORTAR') {
            this.consume('IMPORTAR');
            const identificators: string[] = [];
            const isDestructured = this.peek().type === 'L_BRACE';

            if (isDestructured) {
                this.consume('L_BRACE');
                while (this.peek().type !== 'R_BRACE') {
                    identificators.push(this.consume('IDENTIFICADOR', "Se esperaba un nombre de variable para importar").value);
                    if (this.peek().type === ',') this.consume(',');
                }
                this.consume('R_BRACE');
            } else {
                identificators.push(this.consume('IDENTIFICADOR', "Después de 'importar' debe ir '{' o el nombre de una variable").value);
            }

            this.consume('DESDE', `Se esperaba la palabra 'desde' después de los identificadores.`);

            const pathToken = this.consume('TEXTO', `Debes especificar la ruta entre comillas (texto).`);
            const modulePath = pathToken.value;

            return this.createNode<ImportNode<T, N>>({
                type: 'Importar',
                identificators,
                path: modulePath,
                isDestructured
            });
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

    private parseProperty(): PropertyNode<T, N> {
        this.consume('PROP');
        const id = this.consume('IDENTIFICADOR', `Se debe especificar el nombre de la propiedad`).value;
        
        let value = this.createNode<LiteralNode<T>>({
            type: 'Literal',
            value: undefined,
            raw: 'indefinido'
        });

        if (this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parseExpression() as LiteralNode<T>;
        }

        this.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Property
        });

        return this.createNode<PropertyNode<T, N>>({
            type: 'Propiedad',
            id,
            value
        });
    }
}