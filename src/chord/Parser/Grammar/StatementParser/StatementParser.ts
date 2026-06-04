import { DecoratorProcessor } from "../../../DecoratorProcessor";
import { ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../types";
import { Parser } from "../../Parser";
import { SubParser } from "../../SubParser";
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

export class StatementParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [];

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

        if (token.type === TokenType.Decorador) {
            const decorator = token.value;
            this.consume(TokenType.Decorador);
        
            if (decorator === '@asincrono') {
                DecoratorProcessor.addDecorator('asincrono', true);
            }
        
            if (decorator === '@BDOI') {
                DecoratorProcessor.addDecorator('BDOI', true);
            }

            if (decorator === '@fijar') {
                DecoratorProcessor.addDecorator('fijar', true);
            }

            return (this.parent.get(StatementParser)).parse(classContext);
        }

        switch (token.type) {
            case TokenType.Var:
                return this.parent.get(VariableParser).parse();
            case TokenType.Si:
                return this.parent.get(ConditionParser).parse();
            case TokenType.Para:
                return this.parent.get(LoopParser).parse();
            case TokenType.Devolver:
                return this.parent.get(ReturnParser).parse();
            case TokenType.Funcion:
                return (this.parent.get(FunctionParser))
                    .setConstructor(false)
                    .setMethod(!!classContext)
                    .parse();
            case TokenType.Prop:
                return (this.parent.get(PropertyParser)).parse();
            case TokenType.Importar:
                return this.parent.get(ImportParser).parse();
            case TokenType.Exportar:
                return this.parent.get(ExportParser).parse();
            case TokenType.Clase:
                return this.parent.get(ClassParser).parse();
            case TokenType.Salir:
                return this.parent.get(ExitParser).parse();
            case TokenType.Pasar:
                return this.parent.get(PassParser).parse();
            case TokenType.IDENTIFICADOR:
                if (classContext && token.value === classContext) { // Constructor
                    const nextToken = this.parent.peek('next');
                    if (nextToken && nextToken.type === TokenType.L_PAREN) {
                        return (this.parent.get(FunctionParser))
                            .setConstructor(true)
                            .setMethod(true)
                            .parse();
                    }
                }
                
                return this.parent.get(ExpressionParser).parse();
            default:
                return this.parent.get(ExpressionParser).parse();
        }
    }
}