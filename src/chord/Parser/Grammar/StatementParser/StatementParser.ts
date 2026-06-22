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

/**
 * Structural statement dispatcher routing token flows down to specialized statement subparsers.
 * @class StatementParser
 * @extends {SubParser<T, N>}
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
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
        
            if (decorator === '@asincrono') DecoratorProcessor.addDecorator('asincrono', true);
            if (decorator === '@BDOI') DecoratorProcessor.addDecorator('BDOI', true);
            if (decorator === '@fijar') DecoratorProcessor.addDecorator('fijar', true);

            return (this.parent.get(StatementParser)).parse(classContext);
        }

        // we got some contextual cases to handle here :)
        if (token.type === TokenType.Funcion) {
            const functionParser = this.parent.get(FunctionParser);
            return functionParser
                .setConstructor(false)
                .setMethod(!!classContext)
                .parse();
        }

        const targetSubParser = this.parent.getChordSubParserByToken(token.type);
        if (targetSubParser) return targetSubParser.parse();

        // Handle special case for constructor detection within class context
        if (token.type === TokenType.IDENTIFICADOR) {
            if (classContext && token.value === classContext) {
                const nextToken = this.parent.peek('next');
                if (nextToken && nextToken.type === TokenType.L_PAREN) {
                    return this.parent.get(FunctionParser)
                        .setConstructor(true)
                        .setMethod(true)
                        .parse();
                }
            }
        }
        
        // If no specific sub-parser is found, default to ExpressionParser
        return this.parent.get(ExpressionParser).parse();
    }
}