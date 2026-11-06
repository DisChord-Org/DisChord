import { SubParser } from "../../SubParser";
import { PropertyNode, ASTNode, BaseNode, DeclarationKind, TokenType, TokenTypeUnion } from "../../../model/types";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";

export class PropertyParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Prop;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Prop ];

    private isClassMember: boolean = false;

    /**
     * @param {boolean} value - Whether the property being parsed belongs to a class, which lets it be named after a reserved word.
     * @returns {this}
     */
    public setClassMember (value: boolean): this {
        this.isClassMember = value;
        return this;
    }

    public parse(): PropertyNode<T, N> {
        const isClassMember = this.isClassMember;
        this.isClassMember = false;

        this.consume(TokenType.Prop);

        const nextToken = this.peek();
        const nameType = isClassMember && this.isReservedMemberName(nextToken) ? nextToken.type : TokenType.IDENTIFICADOR;
        const id = this.declare(DeclarationKind.Property, this.consume(nameType, "Se esperaba el nombre de la propiedad"));
        
        let value: ASTNode<T, N> = this.createUndefinedLiteral();

        if (this.match(TokenType.Es)) {
            value = this.parent.get(ExpressionParser).parse();
        }

        const isStatic: boolean = DecoratorProcessor.matchAndDelete('fijar', true);

        return this.createNode<PropertyNode<T, N>>({
            type: TokenType.PROPIEDAD,
            id,
            value,
            isStatic
        });
    }
}