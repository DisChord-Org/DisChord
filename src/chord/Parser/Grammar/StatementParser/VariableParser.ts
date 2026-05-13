import { SymbolTable } from "../../../SymbolsTable";
import { LiteralNode, VariableNode } from "../../../types";
import { SubParser } from "../../subparser";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class VariableParser<T, N> extends SubParser<T, N> {
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

        this.parent.registerSymbol(id, {
            name: id,
            kind: SymbolKind.Variable
        });

        return this.createNode<VariableNode<T, N>>({
            type: 'Variable',
            id,
            value
        });
    }
}