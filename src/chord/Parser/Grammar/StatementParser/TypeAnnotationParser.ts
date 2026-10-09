import { BaseNode, PrimitiveType, PrimitiveTypeName, TokenType } from "../../../types";
import { AnyDataType, ArrayDataType, DataType, PrimitiveDataType, TupleDataType, UnionDataType, UserClassDataType, VoidDataType } from "../../../model/DataType";
import { coreLibUtils } from "../../../corelib";
import { Parser } from "../../Parser";
import { ChordError, ErrorLevel } from "../../../../errors/ChordError";

/**
 * Parses a `tipo <anotación>` clause: a primitive (`texto`), a core library class (`Mapa`, `Lista`),
 * a class of the user (`Caja`), `cualquiera`, `nada`, a tuple (`[texto, numero]`), any of them in a
 * union (`texto|Mapa|Caja`), or an array of one (`texto[]`, `(texto|numero)[]`, `[texto, numero][]`).
 * The type itself, without the leading `tipo`, is {@link parseType}, for the places that write one
 * without it (a parameter's, a return type's).
 *
 * A name that is neither a primitive nor a core library class becomes a provisional
 * {@link UserClassDataType}: the parser can't tell whether such a class exists, as it may be
 * declared further down the file. `ValidateTypeAnnotationsRule` does.
 *
 * Split out of `VariableParser` on its own: parsing a `var` declaration and parsing everything a
 * `tipo` clause can be are two separate grammars that happened to be growing inside one class.
 * Deliberately *not* a `SubParser`, though: that base class's `parse()` is typed to return an
 * `ASTNode` — a piece of the tree the Generator will later visit — but a `DataType` isn't a tree
 * node at all, it's compile-time metadata that only ever lives on `VariableNode.dataType`, never
 * visited on its own. Forcing that mismatch through `SubParser` (and the `get()`/`triggerToken`
 * registry built for tree-shaped grammar rules) would mean lying about what this class produces;
 * instead it's a plain helper holding a `Parser` reference, calling the same public
 * `consume`/`peek`/`match` a `SubParser` would otherwise just be proxying.
 *
 * The type name isn't a reserved keyword (unlike `tipo` itself, already reserved for the `tipo x`
 * "typeof" operator) — `texto`/`numero`/... stay valid identifiers elsewhere (e.g. a BDO property
 * key like `texto "..."` in `EmbedFooter`), so it's read as a plain `IDENTIFICADOR` and validated
 * contextually here instead of globally.
 *
 * Parentheses are required around a multi-member union only when followed by `[]`
 * (`(texto|numero)[]`, not `texto|numero[]`) — otherwise it's ambiguous whether `[]` binds to the
 * last member or the whole union, the same reason TypeScript requires `(string | number)[]`. A
 * tuple is unambiguous by construction: it opens with `[`, so it's never confused with a trailing
 * array-suffix `[]`.
 * @class TypeAnnotationParser
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export class TypeAnnotationParser<T extends string, N extends BaseNode<T>> {
    /**
     * Every primitive type name accepted after `tipo`, derived from {@link PrimitiveType} itself
     * (the single canonical registry) rather than its own hand-maintained copy — needed here
     * because a `tipo` clause's type name arrives from the Lexer as a plain, unvalidated `string`
     * (see this class's own doc comment for why it isn't a reserved keyword instead) and so has to
     * be checked against this list before it can be trusted as a `PrimitiveTypeName`.
     * @private
     * @readonly
     */
    private readonly primitiveTypeNames: readonly PrimitiveTypeName[] = Object.values(PrimitiveType);

    /**
     * @param parser - Reference to the main Parser orchestrator (its token-stream primitives are
     * public, so this needs no `SubParser` proxy to reach them).
     */
    constructor (private readonly parser: Parser<T, N>) {}

    /**
     * Entry point. Consumes `tipo` and its annotation if present; does nothing (and consumes
     * nothing) otherwise, so a caller can always call this unconditionally after a variable's name.
     * @returns {DataType | undefined} The annotated type, or `undefined` if there's no `tipo`
     * clause to parse.
     * @throws {ChordError} See {@link parseType}.
     */
    public parse (): DataType | undefined {
        if (!this.parser.match(TokenType.TIPO)) return undefined;

        return this.parseType();
    }

    /**
     * Parses a type, without a leading `tipo`.
     * @returns {DataType} The type.
     * @throws {ChordError} If an array of a union, or of a member that is followed by another member,
     * is written without parentheses, or a type is malformed.
     */
    public parseType (): DataType {
        return this.parseUnion(false);
    }

    /**
     * Parses a tuple's element list: `[ <Type> (, <Type>)* ]`. Always at least one element —
     * `tipo []` (an empty tuple) is rejected, since it can never match any list literal and so could
     * never be a useful annotation.
     * @returns {DataType[]} The tuple's element types, in written order.
     * @throws {ChordError} If the element list is empty, or the closing `]` is missing.
     * @private
     */
    private parseTupleElements (): DataType[] {
        this.parser.consume(TokenType.L_SQUARE);

        if (this.parser.peek().type === TokenType.R_SQUARE) throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `Una tupla necesita al menos un tipo: 'tipo [<tipo>, ...]'`,
            location: this.parser.peek().location
        }).format();

        const elements: DataType[] = [ this.parseUnion(false) ];
        while (this.parser.match(TokenType.COMA)) elements.push(this.parseUnion(false));

        this.parser.consume(TokenType.R_SQUARE, `Se esperaba ']' para cerrar la tupla`);
        return elements;
    }

    /**
     * Parses a union of one or more members. A trailing `[]` is ambiguous when nothing delimits the
     * union — `texto|numero[]` could be an array of the last member or of the whole union, and
     * `texto[]|numero` reads as the former — so outside parentheses it is only valid after a single
     * member, and the user is asked to parenthesize otherwise. Inside parentheses the union is
     * delimited, so each member may carry its own `[]`: `(texto[]|numero)`.
     * @param {boolean} inGroup - Whether this union is the content of a parenthesized group.
     * @returns {DataType} The union (or its single member).
     * @throws {ChordError} If an unparenthesized `[]` is ambiguous, or a member is malformed.
     * @private
     */
    private parseUnion (inGroup: boolean): DataType {
        const members: DataType[] = [ this.parseMember(inGroup) ];

        while (this.parser.match(TokenType.PIPE)) members.push(this.parseMember(inGroup));

        const union = UnionDataType.ofTypes(members);
        if (inGroup || !this.peekArraySuffix()) return union;

        if (members.length > 1) throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `Una unión de tipos usada como array debe ir entre paréntesis: (${union.format()})[]`,
            location: this.parser.peek().location
        }).format();

        const array = this.consumeArraySuffixes(union);

        if (this.parser.peek().type === TokenType.PIPE) {
            const location = this.parser.peek().location;
            const rest: DataType[] = [];
            while (this.parser.match(TokenType.PIPE)) rest.push(this.parseMember(false));

            throw new ChordError({
                phase: ErrorLevel.Parser,
                message: `Un tipo con '[]' dentro de una unión debe ir entre paréntesis: ${UnionDataType.ofTypes([ array, ...rest ]).format()}`,
                location
            }).format();
        }

        return array;
    }

    /**
     * Parses one member of a union: a parenthesized type (any type, including an array or a union), a
     * tuple, or a name — a primitive (matched ignoring case), a core library class (matched as
     * written), `cualquiera`, `nada`, or else the name of a class of the user, left for
     * `ValidateTypeAnnotationsRule` to check. Inside a group the member may be followed by its own `[]`.
     * @param {boolean} inGroup - Whether the member is inside a parenthesized group.
     * @returns {DataType} The member's type.
     * @throws {ChordError} If the next token isn't a type at all, or a group isn't closed.
     * @private
     */
    private parseMember (inGroup: boolean): DataType {
        const member = this.parseMemberBase();
        return inGroup ? this.consumeArraySuffixes(member) : member;
    }

    private parseMemberBase (): DataType {
        if (this.parser.match(TokenType.L_PAREN)) {
            const grouped = this.parseUnion(true);
            this.parser.consume(TokenType.R_PAREN, `Se esperaba ')' para cerrar la unión de tipos`);
            return grouped;
        }

        if (this.parser.peek().type === TokenType.L_SQUARE) return TupleDataType.of(this.parseTupleElements());

        const token = this.parser.consume(
            [ TokenType.IDENTIFICADOR, TokenType.Indefinido ],
            `Se esperaba un tipo válido después de 'tipo' (${coreLibUtils.annotableTypeNames()})`
        );

        const lowered = token.value.toLowerCase();
        if ((this.primitiveTypeNames as readonly string[]).includes(lowered)) return PrimitiveDataType.of(lowered as PrimitiveTypeName);

        const classType = coreLibUtils.resolveClassType(token.value) ?? coreLibUtils.resolveClassReceiver(token.value);
        if (classType) return classType;

        if (lowered === 'cualquiera') return AnyDataType.Any;
        if (lowered === 'nada') return VoidDataType.Void;

        return UserClassDataType.of(token.value);
    }

    /** Whether the upcoming tokens are an empty `[]` array-suffix, without consuming them. */
    private peekArraySuffix (): boolean {
        return this.parser.peek().type === TokenType.L_SQUARE && this.parser.peek('next').type === TokenType.R_SQUARE;
    }

    /** Wraps `type` in one array per `[]` that follows it. */
    private consumeArraySuffixes (type: DataType): DataType {
        let result = type;

        while (this.peekArraySuffix()) {
            this.parser.consume(TokenType.L_SQUARE);
            this.parser.consume(TokenType.R_SQUARE);
            result = ArrayDataType.of(result);
        }

        return result;
    }
}
