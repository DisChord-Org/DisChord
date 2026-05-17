import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { ASTNode } from "../../../types";
import { Parser } from "../../parser";
import { SubParser } from "../../subparser";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { ExportParser } from "./ModuleParser/ExportParser";
import { ImportParser } from "./ModuleParser/ImportParser";
import { ClassParser } from "./ClassParser";
import { ConditionParser } from "./ConditionParser";
import { FunctionParser } from "./FunctionParser";
import { LoopParser } from "./LoopParser";
import { PropertyParser } from "./PropertyParser";
import { ReturnParser } from "./ReturnParser";
import { VariableParser } from "./VariableParser";
import { ExitParser } from "./FlowParser/ExitParser";
import { PassParser } from "./FlowParser/PassParser";

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
                DecoratorProcessor.addDecorator('asincrono', true);
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
                    .parse();
            case 'PROP':
                return (this.parent.get(PropertyParser as unknown as any) as PropertyParser<T, N>)
                    .setStatic(false)
                    .parse();
            case 'IMPORTAR':
                return this.parent.get(ImportParser as unknown as any).parse();
            case 'EXPORTAR':
                return this.parent.get(ExportParser as unknown as any).parse();
            case 'CLASE':
                return this.parent.get(ClassParser).parse();
            case 'SALIR':
                return this.parent.get(ExitParser).parse();
            case 'PASAR':
                return this.parent.get(PassParser).parse();
            case 'IDENTIFICADOR':
                if (classContext && token.value === classContext) { // Constructor
                    const nextToken = this.parent.peek('next');
                    if (nextToken && nextToken.type === 'L_EXPRESSION') {
                        return (this.parent.get(FunctionParser as any) as FunctionParser<T, N>)
                            .setConstructor(true)
                            .setMethod(true)
                            .setStatic(false)
                            .parse();
                    }
                }
                
                return this.parent.get(ExpressionParser).parse();
            default:
                return this.parent.get(ExpressionParser).parse();
        }
    }
}