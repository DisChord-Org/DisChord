import { SubParser } from "../../SubParser";
import { PropertyNode, SymbolKind, LiteralNode, ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { Parser } from "../../Parser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";

export class PropertyParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Prop;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Prop ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): PropertyNode<T, N> {
        this.consume(TokenType.Prop);
        const id = this.consume(TokenType.IDENTIFICADOR, "Se esperaba el nombre de la propiedad").value;
        
        let value: ASTNode<T, N> = this.createNode<LiteralNode<T>>({
            type: TokenType.LITERAL,
            value: undefined,
            raw: TokenType.Indefinido
        });

        if (this.match(TokenType.Es)) {
            value = this.parent.parseExpression();
        }

        this.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Property
        }, this.peek('prev').location);

        const isStatic: boolean = DecoratorProcessor.matchAndDelete('fijar', true);

        return this.createNode<PropertyNode<T, N>>({
            type: TokenType.PROPIEDAD,
            id,
            value,
            isStatic
        });
    }
}