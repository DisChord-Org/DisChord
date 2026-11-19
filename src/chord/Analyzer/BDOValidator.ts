import { BDOSchema, fieldKeys, FieldKind, FieldSpec, literalStringValue, NestedSpec } from "../BDOSchema";
import { ASTNode, BaseNode, ListNode, Location, ODBNode, PrimitiveType, TokenType } from "../model/types";
import { DataType, PrimitiveDataType, UnionDataType } from "../model/DataType";

/**
 * Validates a BDO against a {@link BDOSchema} — the Analyzer-side interpreter of that shared
 * schema. A dialect's `AnalysisRule` (e.g. dischord's `ValidateCommandRule`) constructs one bound
 * to how it wants to fail, then calls {@link validate} with the node and its schema, instead of
 * hand-rolling its own `if (!blocks[key]) throw ...` checks — see `BDOSchema` for why the schema
 * itself carries no notion of Discord, and `chord/Generator/BDOResolver` for the same schema's
 * generation-side counterpart.
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export class BDOValidator<T extends string, N extends BaseNode<T>> {
    /**
     * @param fail - Called to report a violation; expected to throw (a dialect's own error type,
     * e.g. `DisChordError`), never to return.
     * @param infer - Gives the type of a value, if it is known, for the fields that declare one (see
     * `FieldSpec.type`). Without it no type is known, so none is checked.
     */
    constructor (
        private readonly fail: (message: string, location: Location) => never,
        private readonly infer: (node: ASTNode<T, N>) => DataType | undefined = () => undefined
    ) {}

    /**
     * The type of a value that can never be a block or a reference to one: a text, a number or a
     * boolean. For a property that takes blocks (`embed`, `boton`) without a schema field of its own.
     * @param {ASTNode<T, N>} node - The value.
     * @returns {DataType | undefined} Its type when it is known to be one of those, `undefined` otherwise.
     */
    public plainValueType (node: ASTNode<T, N>): DataType | undefined {
        const type = this.infer(node);
        const isPlain = type instanceof PrimitiveDataType && type.name !== PrimitiveType.BDO && type.name !== PrimitiveType.Indefinido;

        return isPlain ? type : undefined;
    }

    /**
     * Rejects a value that can never be a block nor a reference to one (`embed 5`, `boton "x"`).
     * @param {ASTNode<T, N>} node - The value given where a block, the name of a declared one or a list of them goes.
     * @param {string} property - The property it was given to (`embed`).
     * @param {string} noun - What the declared one is called, with its article (`un embed`).
     */
    public rejectPlainBlockValue (node: ASTNode<T, N>, property: string, noun: string): void {
        const plain = this.plainValueType(node);

        if (plain) this.fail(`'${property}' espera un bloque { ... }, el nombre de ${noun} declarado o una lista de ellos, se recibió un valor de tipo '${plain.format()}'`, node.location);
    }

    /**
     * Validates every field and nested schema declared in `schema` against `node`.
     * @param {ODBNode<T, N>} node - The BDO to validate.
     * @param {BDOSchema<T, N>} schema - The schema `node` must satisfy.
     * @returns {void}
     */
    public validate (node: ODBNode<T, N>, schema: BDOSchema<T, N>): void {
        if (!schema.open) this.validateKnownKeys(node, schema);

        schema.fields.forEach(field => this.validateField(node, field, schema));
        schema.nested?.forEach(nested => this.validateNested(node, nested));
    }

    /**
     * A key the schema does not declare is an error: it would otherwise be ignored without a word.
     * @private
     */
    private validateKnownKeys (node: ODBNode<T, N>, schema: BDOSchema<T, N>): void {
        const known = [
            ...schema.fields.flatMap(field => fieldKeys(field.key)),
            ...(schema.nested?.map(nested => nested.key) ?? []),
            ...(schema.passthrough ?? [])
        ];

        Object.entries(node.blocks).forEach(([ key, value ]) => {
            if (known.includes(key)) return;

            const subject = schema.name ? `'${schema.name}' no admite '${key}'` : `No se admite la propiedad '${key}'`;

            // `f ("hola")` or `lista [0]`, with a space, is a property whose value starts with a bracket
            const looksLikeCall = value.type === TokenType.EXPRESION || value.type === TokenType.LISTA;
            const hint = looksLikeCall ? ` Si querías usar '${key}' como llamada o índice, escríbelo pegado: ${key}(...) o ${key}[...].` : '';

            this.fail(`${subject}. Se admite: ${known.join(' / ')}.${hint}`, value.location);
        });
    }

    /**
     * @private
     */
    private validateField (node: ODBNode<T, N>, field: FieldSpec, schema: BDOSchema<T, N>): void {
        const key = fieldKeys(field.key).find(candidate => node.blocks[candidate]);
        const value = key ? node.blocks[key] : undefined;

        if (!value) {
            if (field.required && field.missingMessage) this.fail(field.missingMessage, node.location);
            return;
        }

        if (field.kind === FieldKind.List && value.type !== TokenType.LISTA && field.invalidMessage) {
            this.fail(field.invalidMessage, value.location);
        }

        if (field.type) this.validateType(value, field.type, schema, key!);

        if (field.kind === FieldKind.MappedLiteral) this.validateMappedLiteral(value, field, schema, key!);
        if (field.kind === FieldKind.MappedList) this.validateMappedList(value, field, schema, key!);
        if (field.kind === FieldKind.NamedValue) this.validateNamedValue(value, field);
    }

    /**
     * A value whose type is known and can never be the one the field takes is an error: it would be
     * emitted as it is and rejected, or ignored, when the program runs.
     * @private
     */
    private validateType (value: ASTNode<T, N>, expected: DataType, schema: BDOSchema<T, N>, key: string): void {
        const found = this.infer(value);
        if (!found || this.canBe(expected, found)) return;

        const subject = schema.name ? `'${schema.name}' espera` : 'Se espera';

        this.fail(`${subject} un valor de tipo '${expected.format()}' en '${key}', se recibió '${found.format()}'`, value.location);
    }

    /**
     * Whether a value of type `found` may be of the `expected` one when the program runs: a union
     * (`texto|indefinido`) may, if any of its members is.
     * @private
     */
    private canBe (expected: DataType, found: DataType): boolean {
        if (found instanceof UnionDataType) return found.members.some(member => this.canBe(expected, member));

        return expected.isAssignableFrom(found);
    }

    /**
     * @private
     */
    private validateNamedValue (value: ASTNode<T, N>, field: FieldSpec): void {
        const literal = literalStringValue(value);

        if (literal !== undefined && !Object.prototype.hasOwnProperty.call(field.mapping ?? {}, literal)) this.fail(field.unknownMessage!(literal), value.location);
    }

    /**
     * What to say about a value of a closed-vocabulary field that is not a literal (an identifier,
     * an expression, a text with braces, which is one): it can't be known at compile time, so it can
     * never be one of the words the field accepts.
     * @private
     */
    private notALiteralMessage (field: FieldSpec, schema: BDOSchema<T, N>, key: string, perItem: boolean): string {
        const where = perItem ? `en cada elemento de '${key}'` : `en '${key}'`;
        const subject = schema.name ? `'${schema.name}' no admite expresiones ni texto con llaves ${where}` : `No se admiten expresiones ni texto con llaves ${where}`;

        return `${subject}: escribe uno de: ${Object.keys(field.mapping ?? {}).join(' / ')}`;
    }

    /**
     * @private
     */
    private validateMappedLiteral (value: ASTNode<T, N>, field: FieldSpec, schema: BDOSchema<T, N>, key: string): void {
        const literal = literalStringValue(value);

        if (literal === undefined) {
            if (value.type !== TokenType.LITERAL) this.fail(this.notALiteralMessage(field, schema, key, false), value.location);
            if (field.invalidMessage) this.fail(field.invalidMessage, value.location);
            return;
        }

        if (field.mapping?.[literal] === undefined) this.fail(field.unknownMessage!(literal), value.location);
    }

    /**
     * @private
     */
    private validateMappedList (value: ASTNode<T, N>, field: FieldSpec, schema: BDOSchema<T, N>, key: string): void {
        if (value.type !== TokenType.LISTA) {
            if (field.invalidMessage) this.fail(field.invalidMessage, value.location);
            return;
        }

        (value as ListNode<T, N>).body.forEach(item => {
            const literal = literalStringValue(item);

            if (literal === undefined) {
                if (item.type !== TokenType.LITERAL) this.fail(this.notALiteralMessage(field, schema, key, true), item.location);
                this.fail(field.invalidMessage ?? field.unknownMessage!(''), item.location);
            } else if (field.mapping?.[literal] === undefined) this.fail(field.unknownMessage!(literal), item.location);
        });
    }

    /**
     * Validates a nested BDO field: every entry (`forEachEntry`, e.g. `opciones`) or list element
     * (`forEachItem`, e.g. `campos`) found at `nested.key` is itself validated against
     * `nested.schema` (or `nested.schemaFor`, built per entry).
     * @private
     */
    private validateNested (node: ODBNode<T, N>, nested: NestedSpec<T, N>): void {
        const value = node.blocks[nested.key];
        if (!value) return;

        const holder = nested.forEachItem ? TokenType.LISTA : TokenType.BDO;
        if (value.type !== holder && nested.invalidMessage) this.fail(nested.invalidMessage, value.location);

        if (nested.forEachEntry) {
            if (value.type !== TokenType.BDO) return;

            Object.entries((value as ODBNode<T, N>).blocks).forEach(([ entryKey, entry ]) => {
                if (entry.type !== TokenType.BDO) return;

                const schema = nested.schemaFor
                    ? nested.schemaFor(entryKey, entry as ODBNode<T, N>)
                    : nested.schema!;

                this.validate(entry as ODBNode<T, N>, schema);
            });
            return;
        }

        if (nested.forEachItem) {
            if (value.type !== TokenType.LISTA) return;

            (value as ListNode<T, N>).body.forEach(item => {
                if (item.type !== TokenType.BDO) {
                    if (nested.typeMismatchMessage) this.fail(nested.typeMismatchMessage(item.type), item.location);
                    return;
                }
                this.validate(item as ODBNode<T, N>, nested.schema!);
            });
            return;
        }

        if (value.type === TokenType.BDO) this.validate(value as ODBNode<T, N>, nested.schema!);
    }
}
