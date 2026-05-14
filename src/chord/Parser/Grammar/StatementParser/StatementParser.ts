import { StatementMap } from "../../../core.lib";
import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { ASTNode } from "../../../types";
import { Parser } from "../../parser";
import { SubParser, SubParserClass } from "../../subparser";
import { ExpressionParser } from "../Expressions/ExpressionParser";

export class StatementParser<T, N> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: string = '';

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    public parse(classContext?: string): ASTNode<T, N> {
        const token = this.peek();

        const custom = this.parent.parseCustomStatement();
        if (custom) return custom;

        if (token.type === 'DECORADOR') {
            const decorator = token.value;
            this.consume('DECORADOR');
        
            if (decorator === '@asincrono') {
                /*this.consume('DECORADOR');

                if (this.peek().type === 'FIJAR') {
                    this.consume('FIJAR');
                    const func = this.parseFunctionDeclaration(false, true, true);
                    func.metadata.isStatic = true;
                    return func;
                }
        
                const func = this.parseFunctionDeclaration(false, !!classContext, true);
                return func;*/
            }
        
            if (decorator === '@BDOI') {
                DecoratorProcessor.addDecorator('BDOI', true);
            }

            return (this.parent.get(StatementParser) as StatementParser<T, N>).parse(classContext);
        }

        const statement: SubParserClass<T, N> | undefined = StatementMap[token.type];

        if (statement) return this.parent.get(statement).parse();
        else return this.parent.get(ExpressionParser).parse();
    }
}