import { SubParser } from "../../subparser";
import { ConditionNode, ASTNode } from "../../../types";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class ConditionParser<T, N> extends SubParser<T, N> {
    public parse(): ConditionNode<T, N> {
        this.consume('SI');

        this.consume('L_EXPRESSION', `Después de 'si' se debe abrir una expresión con '(' para especificar la condición.`);
        const test = this.parent.get(ExpressionParser).parse();
        this.consume('R_EXPRESSION');

        this.consume('L_BRACE', `Después de la condición de un 'si' se debe abrir un bloque de código con '{'.`);
        const consequent: ASTNode<T, N>[] = [];

        while (this.peek().type !== 'R_BRACE') {
            consequent.push(this.parent.get(ExpressionParser).parse());
        }

        this.consume('R_BRACE');

        let alternate: ConditionNode<T, N>['alternate'] = undefined;

        if (this.parent.cursor < this.parent.tokens.length && (this.peek().type === 'SINO' || this.peek().type === 'ADEMAS')) {
            const next = this.consume(this.peek().type);

            if (next.type === 'ADEMAS') {
                alternate = this.parse();
            } else {
                this.consume('L_BRACE', `Después de 'sino' se debe abrir un bloque de código con '{'.`);

                const elseBody: ASTNode<T, N>[] = [];

                while (this.peek().type !== 'R_BRACE') {
                    elseBody.push(this.parse());
                }

                this.consume('R_BRACE');
                alternate = elseBody;
            }
        }

        return this.createNode<ConditionNode<T, N>>({
            type: 'Condicion',
            test,
            consequent,
            alternate
        });
    }
}