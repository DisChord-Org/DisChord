import { SubParser } from "../../subparser";
import { ASTNode, ExpressionNode, JSNode, ListNode, NewNode, ODBMode } from "../../../types";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { AssignmentParser } from "../Expressions/AssignmentParser";
import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { ChordError, ErrorLevel } from "../../../../ChordError";
import { BDOParser } from "../BDOParser";
import { LiteralParser } from "../Expressions/LiteralParser";
import { AccessParser } from "../Expressions/AccessParser";

export class PrimaryParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = '';
    
    public parse(): ASTNode<T, N> {
        const token = this.peek();

        if (token.type === 'NUEVO') {
            this.consume('NUEVO');
            const call = this.parent.get(AccessParser).parse(); 
            return this.createNode<NewNode<T, N>>({
                type: 'Nuevo',
                object: call
            });
        }

        if (token.type === 'L_SQUARE') {
            this.consume('L_SQUARE');
            const elements: ASTNode<T, N>[] = [];
            while (this.peek().type !== 'R_SQUARE') {
                elements.push(this.parent.get(AssignmentParser).parse());
                if (this.peek().type === ',') this.consume(',');
            }
            this.consume('R_SQUARE');
            return this.createNode<ListNode<T, N>>({
                type: 'Lista',
                body: elements
            });
        }

        if (token.type === 'L_BRACE') {
            const isIntelligent = DecoratorProcessor.matchAndDelete('BDOI', true);
            const parser: BDOParser<T, N> = this.parent.get(BDOParser) as BDOParser<T, N>;

            return parser.setMode(isIntelligent ? ODBMode.Intelligent : ODBMode.Simple).parse();
        }

        if (token.type === 'L_EXPRESSION') {
            this.consume('L_EXPRESSION');
            const node = this.parent.get(ExpressionParser).parse();
            this.consume('R_EXPRESSION');

            return this.createNode<ExpressionNode<T, N>>({
                type: 'Expresion',
                object: node,
            });
        }

        if (token.value === 'js') {
            this.consume('JS');
            this.consume('L_EXPRESSION');
            const content = this.consume('TEXTO').value;
            this.consume('R_EXPRESSION');
            
            return this.createNode<JSNode<T>>({
                type: 'JS',
                value: content
            });
        }

        if ([ 'IDENTIFICADOR', 'ESTA', 'SUPER' ].includes(token.type)) {
            return this.parent.get(AccessParser).parse();
        }

        if ([ 'NUMERO', 'TEXTO', 'BOOL', 'INDEFINIDO' ].includes(token.type)) {
            return this.parent.get(LiteralParser).parse();
        }

        throw new ChordError(
            ErrorLevel.Parser,
            `Token inesperado en expresión: ${token.type} en la posición ${this.parent.cursor}`,
            token.location
        ).format();
    }
}