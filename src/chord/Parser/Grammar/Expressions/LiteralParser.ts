import { SubParser } from "../../subparser";
import { ASTNode, LiteralNode } from "../../../types";
import { Parser } from "../../parser";

export class LiteralParser<T = any, N = any> extends SubParser<T, N> {
    
    constructor(parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ASTNode<T, N> {
        const token = this.consume(['NUMERO', 'TEXTO', 'BOOL', 'INDEFINIDO'], `Se esperaba un literal (número, texto, booleano o indefinido)`);

        let value: boolean | number | string | undefined = token.value;

        switch (token.type) {
            case 'BOOL':
                value = token.value === 'verdadero';
                break;
            case 'NUMERO':
                value = Number(token.value);
                break;
            case 'INDEFINIDO':
                value = undefined;
                break;
        }

        return this.createNode<LiteralNode<T>>({
            type: 'Literal',
            value,
            raw: token.value
        });
    }
}