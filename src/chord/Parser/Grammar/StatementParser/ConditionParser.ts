import { SubParser } from "../../subparser";
import { ConditionNode, ASTNode, BlockNode } from "../../../types";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { BlockParser } from "../BlockParser";
import { Parser } from "../../parser";

export class ConditionParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = 'SI';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(): ConditionNode<T, N> {
        this.consume('SI');

        this.consume('L_EXPRESSION', `Después de 'si' se debe abrir una expresión con '(' para especificar la condición.`);
        const test = this.parent.get(ExpressionParser).parse();
        this.consume('R_EXPRESSION');

        this.consume('L_BRACE', `Después de la condición de un 'si' se debe abrir un bloque de código con '{'.`);
        const consequent: ASTNode<T, N>[] = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;
        this.consume('R_BRACE');

        let alternate: ConditionNode<T, N>['alternate'] = undefined;

        if (this.match('ADEMAS')) {
            alternate = this.parse();
        } else if (this.match('SINO')) {
            this.consume('L_BRACE', "Después de 'sino' se debe abrir un bloque con '{'.");
            alternate = (this.parent.get(BlockParser) as BlockParser<T, N>).parse().body;
            this.consume('R_BRACE');
        }

        return this.createNode<ConditionNode<T, N>>({
            type: 'Condicion',
            test,
            consequent,
            alternate
        });
    }
}