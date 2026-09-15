import { ASTNode, BaseNode, LiteralNode, TokenType, TokenTypeUnion, VariableNode } from "../../../types";
import { Parser } from "../../Parser";
import { SubParser } from "../../SubParser";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { TypeAnnotationParser } from "./TypeAnnotationParser";

/**
 * Parses a `var` declaration: `var <id> [tipo <anotación>] [es <expr>]`.
 *
 * The optional `tipo <anotación>` clause is a compile-time-only type annotation — see
 * `TypeAnnotationParser` for everything it can be (primitive, union, array, tuple) and why. It
 * never affects the generated JavaScript, only what the Analyzer's "Tipos" pass
 * (`ResolveVariableTypesRule`) records for the variable in the `SymbolTable`. Whether it's present
 * or not, `var` behaves exactly as before: a bare `var x` still declares `x` as `indefinido`.
 * @class VariableParser
 * @extends {SubParser<T, N>}
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export class VariableParser<T extends string, N extends BaseNode<T>> extends SubParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined = TokenType.Var;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Var ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Entry point for the SubParser. Consumes `var`, the variable's name, its optional `tipo`
     * annotation (delegated to `TypeAnnotationParser`), and — if followed by `es` — its
     * initializer expression.
     * @returns {VariableNode<T, N>} The parsed variable declaration, `dataType` set only when a
     * `tipo` clause was present (inference from the initializer happens later, in the Analyzer).
     */
    public parse(): VariableNode<T, N> {
        this.consume(TokenType.Var);
        const id = this.consume(TokenType.IDENTIFICADOR, `Se debe especificar un nombre para la variable`).value;

        const dataType = new TypeAnnotationParser(this.parent).parse();

        let value: ASTNode<T, N> = this.createNode<LiteralNode<T>>({
            type: TokenType.LITERAL,
            value: undefined,
            raw: TokenType.Indefinido
        });

        if (this.match(TokenType.Es)) {
            value = this.parent.get(ExpressionParser).parse();
        }

        return this.createNode<VariableNode<T, N>>({
            type: TokenType.VARIABLE,
            id,
            value,
            dataType
        });
    }
}
