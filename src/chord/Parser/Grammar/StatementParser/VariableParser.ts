import { ASTNode, BaseNode, LiteralNode, SymbolKind, TokenType, TokenTypeUnion, VariableNode } from "../../../types";
import { Parser } from "../../Parser";
import { SubParser } from "../../subparser";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class VariableParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Var;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Var ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): VariableNode<T, N> {
        this.consume(TokenType.Var);
        const id = this.consume(TokenType.IDENTIFICADOR, `Se debe especificar un nombre para la variable`).value;
        
        let value: ASTNode<T, N> = this.createNode<LiteralNode<T>>({
            type: TokenType.LITERAL,
            value: undefined,
            raw: TokenType.Indefinido
        });

        if (this.match(TokenType.Es)) {
            value = this.parent.get(ExpressionParser).parse();
        }

        this.parent.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Variable
        }, this.peek().location);

        return this.createNode<VariableNode<T, N>>({
            type: TokenType.VARIABLE,
            id,
            value
        });
    }
}