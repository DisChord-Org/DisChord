import { SubParser } from "../../subparser";
import { PropertyNode, SymbolKind, LiteralNode, ASTNode } from "../../../types";
import { Parser } from "../../parser";

export class PropertyParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'PROP';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    private isStatic: boolean = false;

    public setStatic(value: boolean): this {
        this.isStatic = value;
        return this;
    }

    public parse(): PropertyNode<T, N> {
        const isStatic = this.isStatic;
        this.isStatic = false;

        this.consume('PROP');
        const id = this.consume('IDENTIFICADOR', "Se esperaba el nombre de la propiedad").value;
        
        let value: ASTNode<T, N> = this.createNode<LiteralNode<T>>({
            type: 'Literal',
            value: undefined,
            raw: 'indefinido'
        });

        if (this.match('ES')) {
            value = this.parent.parseExpression();
        }

        this.SymbolTable.register(id, {
            name: id,
            kind: SymbolKind.Property
        }, this.peek('prev').location);

        return this.createNode<PropertyNode<T, N>>({
            type: 'Propiedad',
            id,
            value,
            isStatic
        });
    }
}