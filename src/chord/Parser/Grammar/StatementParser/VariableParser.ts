import { ASTNode, BaseNode, LiteralNode, PrimitiveType, PrimitiveTypeName, TokenType, TokenTypeUnion, VariableNode } from "../../../types";
import { arrayOf, DataType, formatDataType, unionOf } from "../../../DataType";
import { Parser } from "../../Parser";
import { SubParser } from "../../SubParser";
import { ExpressionParser } from "../Expressions/ExpressionParser";
import { ChordError, ErrorLevel } from "../../../../errors/ChordError";

/**
 * Parses a `var` declaration: `var <id> [tipo <nombre>] [es <expr>]`.
 *
 * The optional `tipo <nombre>` clause is a compile-time-only primitive type annotation (see
 * {@link PrimitiveTypeName} for the full set) — it never affects the generated JavaScript, only
 * what the Analyzer's "Tipos" pass (`ResolveVariableTypesRule`) records for the variable in the
 * `SymbolTable`. Whether it's present or not, `var` behaves exactly as before: a bare `var x`
 * still declares `x` as `indefinido`.
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
     * Every primitive type name accepted after `tipo` in a variable declaration — the runtime
     * counterpart of the {@link PrimitiveTypeName} union, needed here because a `tipo` clause's
     * type name arrives from the Lexer as a plain, unvalidated `string` (see
     * `parseTypeAnnotation`'s doc comment for why it isn't a reserved keyword instead) and so has
     * to be checked against this list before it can be trusted as a `PrimitiveTypeName`.
     * @private
     * @readonly
     */
    private readonly primitiveTypeNames: readonly PrimitiveTypeName[] = [
        PrimitiveType.Texto, PrimitiveType.Numero, PrimitiveType.Booleano, PrimitiveType.Objeto, PrimitiveType.Indefinido
    ];

    /**
     * @param parent - Reference to the main Parser orchestrator.
     */
    constructor (protected parent: Parser<T, N>) {
        super(parent);
    }

    /**
     * Entry point for the SubParser. Consumes `var`, the variable's name, its optional `tipo`
     * annotation, and — if followed by `es` — its initializer expression.
     * @returns {VariableNode<T, N>} The parsed variable declaration, `dataType` set only when a
     * `tipo` clause was present (inference from the initializer happens later, in the Analyzer).
     */
    public parse(): VariableNode<T, N> {
        this.consume(TokenType.Var);
        const id = this.consume(TokenType.IDENTIFICADOR, `Se debe especificar un nombre para la variable`).value;

        const dataType = this.parseTypeAnnotation();

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

    /**
     * Parses the optional `tipo <nombre>` primitive type annotation following a variable's name.
     * `tipo` itself was already a reserved word before this feature (the `tipo x` unary "typeof"
     * operator, see `UnaryParser`), so no new keyword is introduced there. The type *name* that
     * follows it (`texto`, `numero`, ...), however, is deliberately **not** turned into a reserved
     * keyword the way `tipo` is:
     *
     * The Lexer resolves keywords globally and context-free — `KeywordsManager.extend` maps a
     * literal word to a `TokenType` everywhere it appears, regardless of grammatical position (see
     * `Lexer.tokenize`'s `keywordsManager.isKeyword`/`resolve` branch). `BDOParser` already relies
     * on that same word being lexed as plain `IDENTIFICADOR` to use it as a property key — e.g.
     * `texto "..."` inside an embed's `pie` block (`EmbedFooter` fixture) — and in fact
     * *deliberately* rejects any token that resolves as a keyword there
     * (`BDOParser.checkPropertyPattern`'s `KeywordsManager.isKeyword(current.value)` guard), unlike
     * JS's own object literals, which special-case `PropertyName` to allow reserved words. Reserving
     * `texto` globally would silently break that property key (and any other unreserved-word usage)
     * everywhere in the language, not just after `tipo`.
     *
     * So instead, the word after `tipo` is read as a plain `IDENTIFICADOR` (or `Indefinido`, which
     * *is* already reserved) and validated here, contextually, against the known primitive set —
     * exactly the same effect for this one grammatical slot, with zero blast radius elsewhere.
     *
     * A trailing `[]` right after the type name or union (`tipo texto[]`, `tipo (texto|numero)[]`,
     * no space) marks a homogeneous array of it instead of a bare scalar — reusing the same
     * `L_SQUARE`/`R_SQUARE` tokens the array-literal grammar itself already registers
     * (`PrimaryParser`), so again no new keyword or bracket token is introduced for this feature.
     * Nesting (`texto[][]`) isn't supported: only one trailing `[]` is consumed.
     *
     * A union of two or more primitives (`tipo texto|numero`) must be wrapped in parentheses when
     * combined with `[]` (`tipo (texto|numero)[]`) — `tipo texto|numero[]`, without parentheses,
     * is rejected rather than guessed at, since it's genuinely ambiguous whether `[]` binds to just
     * `numero` or to the whole union (exactly the reason TypeScript itself requires
     * `(string | number)[]`, not `string | number[]`, for the same shape). Parentheses are optional
     * everywhere else: a bare union with no `[]` (`tipo texto|numero`) is never ambiguous, and
     * neither is a single type with `[]` (`tipo texto[]`).
     * @returns {DataType | undefined} The annotated type (scalar, union, or array of either), or
     * `undefined` if no `tipo` clause is present.
     * @throws {ChordError} If a type name in the annotation isn't one of `this.primitiveTypeNames`,
     * or if a multi-member union is combined with `[]` without parentheses.
     */
    private parseTypeAnnotation(): DataType | undefined {
        if (!this.match(TokenType.TIPO)) return undefined;

        const hasParens = this.match(TokenType.L_PAREN);
        const kinds: PrimitiveTypeName[] = [ this.parsePrimitiveKind() ];

        while (this.match(TokenType.PIPE)) kinds.push(this.parsePrimitiveKind());

        if (hasParens) this.consume(TokenType.R_PAREN, `Se esperaba ')' para cerrar la unión de tipos`);

        const scalarType = unionOf(kinds);
        const isArray = this.peek().type === TokenType.L_SQUARE && this.peek('next').type === TokenType.R_SQUARE;

        if (!isArray) return scalarType;

        if (kinds.length > 1 && !hasParens) throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `Una unión de tipos usada como array debe ir entre paréntesis: (${formatDataType(scalarType)})[]`,
            location: this.peek().location
        }).format();

        this.consume(TokenType.L_SQUARE);
        this.consume(TokenType.R_SQUARE);

        return arrayOf(scalarType);
    }

    /**
     * Parses and validates a single primitive type name within a `tipo` annotation (one member of
     * a union, or the whole annotation when there's no union at all).
     * @returns {PrimitiveTypeName} The validated primitive type name.
     * @throws {ChordError} If the word isn't one of `this.primitiveTypeNames`.
     * @private
     */
    private parsePrimitiveKind(): PrimitiveTypeName {
        const typeToken = this.consume(
            [ TokenType.IDENTIFICADOR, TokenType.Indefinido ],
            `Se esperaba un tipo válido después de 'tipo' (${this.primitiveTypeNames.join(', ')})`
        );

        const typeName = typeToken.value.toLowerCase();
        const isKnownPrimitive = (this.primitiveTypeNames as readonly string[]).includes(typeName);

        if (!isKnownPrimitive) throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `Tipo desconocido '${typeToken.value}'. Tipos válidos: ${this.primitiveTypeNames.join(', ')}`,
            location: typeToken.location
        }).format();

        return typeName as PrimitiveTypeName;
    }
}