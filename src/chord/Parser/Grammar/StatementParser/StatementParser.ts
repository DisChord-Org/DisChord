import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { ASTNode } from "../../../types";
import { Parser } from "../../parser";
import { SubParser } from "../../subparser";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { ConditionParser } from "./ConditionParser";
import { FunctionParser } from "./FunctionParser";
import { LoopParser } from "./LoopParser";
import { PropertyParser } from "./PropertyParser";
import { ReturnParser } from "./ReturnParser";
import { VariableParser } from "./VariableParser";

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

        switch (token.type) {
            case 'VAR':
                return this.parent.get(VariableParser as unknown as any).parse();
            case 'CONDICION':
                return this.parent.get(ConditionParser).parse();
            case 'PARA':
                return this.parent.get(LoopParser).parse();
            case 'DEVOLVER':
                return this.parent.get(ReturnParser).parse();
            case 'FUNCION':
                return (this.parent.get(FunctionParser) as FunctionParser<T, N>)
                    .setConstructor(false)
                    .setMethod(!!classContext)
                    .setStatic(false)
                    .setAsync(false)
                    .parse();
            case 'PROP':
                return (this.parent.get(PropertyParser as unknown as any) as PropertyParser<T, N>)
                    .setStatic(false)
                    .parse();
            default:
                return this.parent.get(ExpressionParser).parse();
        }
    }
}