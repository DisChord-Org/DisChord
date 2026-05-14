import { LiteralNode, SymbolKind, VariableNode } from "../../../types";
import { Parser } from "../../parser";
import { SubParser } from "../../subparser";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class VariableParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = '';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): VariableNode<T, N> {
        this.consume('VAR');
        const id = this.consume('IDENTIFICADOR', `Se debe especificar un nombre para la variable`).value;
        
        let value: any = this.createNode<LiteralNode<T>>({
            type: 'Literal',
            value: undefined,
            raw: 'indefinido'
        });

        if (this.peek().type === 'ES') {
            this.consume('ES');
            value = this.parent.get(ExpressionParser).parse();
        }

        this.parent.context.symbolTable.register(id,
            {
                name: id,
                kind: SymbolKind.Variable
            },
            this.peek().location
        );

        return this.createNode<VariableNode<T, N>>({
            type: 'Variable',
            id,
            value
        });
    }
}