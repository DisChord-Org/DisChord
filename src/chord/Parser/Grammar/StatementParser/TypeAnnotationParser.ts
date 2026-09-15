import { BaseNode, PrimitiveType, PrimitiveTypeName, TokenType } from "../../../types";
import { arrayOf, DataType, formatDataType, tupleOf, unionOf } from "../../../DataType";
import { Parser } from "../../Parser";
import { ChordError, ErrorLevel } from "../../../../errors/ChordError";

/**
 * Parses a `tipo <anotación>` clause: a primitive (`texto`), a union (`texto|numero`), an array
 * (`texto[]`, `(texto|numero)[]`), or a tuple (`[texto, numero]`, itself array-able as
 * `[texto, numero][]`).
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
     * Every primitive type name accepted after `tipo` — the runtime counterpart of the
     * {@link PrimitiveTypeName} union, needed here because a `tipo` clause's type name arrives
     * from the Lexer as a plain, unvalidated `string` (see this class's own doc comment for why
     * it isn't a reserved keyword instead) and so has to be checked against this list before it
     * can be trusted as a `PrimitiveTypeName`.
     * @private
     * @readonly
     */
    private readonly primitiveTypeNames: readonly PrimitiveTypeName[] = [
        PrimitiveType.Texto, PrimitiveType.Numero, PrimitiveType.Booleano, PrimitiveType.Objeto, PrimitiveType.Indefinido
    ];

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
     * @throws {ChordError} If a type name isn't one of `this.primitiveTypeNames`, or if a
     * multi-member union is combined with `[]` without parentheses.
     */
    public parse (): DataType | undefined {
        if (!this.parser.match(TokenType.TIPO)) return undefined;

        if (this.parser.peek().type === TokenType.L_SQUARE) {
            const tupleType = tupleOf(this.parseTupleElements());
            return this.matchArraySuffix() ? arrayOf(tupleType) : tupleType;
        }

        const { type: scalarType, hasParens, kindCount } = this.parseUnionType();

        if (!this.peekArraySuffix()) return scalarType;

        if (kindCount > 1 && !hasParens) throw new ChordError({
            phase: ErrorLevel.Parser,
            message: `Una unión de tipos usada como array debe ir entre paréntesis: (${formatDataType(scalarType)})[]`,
            location: this.parser.peek().location
        }).format();

        this.consumeArraySuffix();
        return arrayOf(scalarType);
    }

    /**
     * Parses a tuple's element list: `[ <UnionType> (, <UnionType>)* ]`. Always at least one
     * element — `tipo []` (an empty tuple) is rejected, since it can never match any list literal
     * and so could never be a useful annotation.
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

        const elements: DataType[] = [ this.parseUnionType().type ];
        while (this.parser.match(TokenType.COMA)) elements.push(this.parseUnionType().type);

        this.parser.consume(TokenType.R_SQUARE, `Se esperaba ']' para cerrar la tupla`);
        return elements;
    }

    /**
     * Parses a (possibly parenthesized) union of one or more primitives: the building block both
     * the top-level annotation and each tuple element parse the same way. Reports whether
     * parentheses were used and how many members were found, since only the top-level annotation
     * needs those to decide whether a following `[]` is ambiguous — a tuple element is never
     * followed by its own `[]`, so it just discards them.
     * @returns {{ type: DataType; hasParens: boolean; kindCount: number }} The parsed type, plus
     * the two facts only the caller can judge whether it needs.
     * @throws {ChordError} If a type name isn't one of `this.primitiveTypeNames`, or (when
     * parenthesized) the closing `)` is missing.
     * @private
     */
    private parseUnionType (): { type: DataType; hasParens: boolean; kindCount: number } {
        const hasParens = this.parser.match(TokenType.L_PAREN);
        const kinds: PrimitiveTypeName[] = [ this.parsePrimitiveKind() ];

        while (this.parser.match(TokenType.PIPE)) kinds.push(this.parsePrimitiveKind());

        if (hasParens) this.parser.consume(TokenType.R_PAREN, `Se esperaba ')' para cerrar la unión de tipos`);

        return { type: unionOf(kinds), hasParens, kindCount: kinds.length };
    }

    /** Whether the upcoming tokens are an empty `[]` array-suffix, without consuming them. */
    private peekArraySuffix (): boolean {
        return this.parser.peek().type === TokenType.L_SQUARE && this.parser.peek('next').type === TokenType.R_SQUARE;
    }

    /** Consumes an `[]` array-suffix already confirmed present by {@link peekArraySuffix}. */
    private consumeArraySuffix (): void {
        this.parser.consume(TokenType.L_SQUARE);
        this.parser.consume(TokenType.R_SQUARE);
    }

    /** Consumes an `[]` array-suffix if present, reporting whether it did. */
    private matchArraySuffix (): boolean {
        if (!this.peekArraySuffix()) return false;
        this.consumeArraySuffix();
        return true;
    }

    /**
     * Parses and validates a single primitive type name within a `tipo` annotation (one member of
     * a union, or the whole annotation when there's no union at all).
     * @returns {PrimitiveTypeName} The validated primitive type name.
     * @throws {ChordError} If the word isn't one of `this.primitiveTypeNames`.
     * @private
     */
    private parsePrimitiveKind (): PrimitiveTypeName {
        const typeToken = this.parser.consume(
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
