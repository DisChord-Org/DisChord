import { BDOSchema, fieldKeys, FieldKind, FieldSpec, literalStringValue, NestedSpec } from "../BDOSchema";
import { ASTNode, BaseNode, ListNode, Location, ODBNode, TokenType } from "../types";

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
     */
    constructor (private readonly fail: (message: string, location: Location) => never) {}

    /**
     * Validates every field and nested schema declared in `schema` against `node`.
     * @param {ODBNode<T, N>} node - The BDO to validate.
     * @param {BDOSchema<T, N>} schema - The schema `node` must satisfy.
     * @returns {void}
     */
    public validate (node: ODBNode<T, N>, schema: BDOSchema<T, N>): void {
        schema.fields.forEach(field => this.validateField(node, field));
        schema.nested?.forEach(nested => this.validateNested(node, nested));
    }

    /**
     * @private
     */
    private validateField (node: ODBNode<T, N>, field: FieldSpec): void {
        const key = fieldKeys(field.key).find(candidate => node.blocks[candidate]);
        const value = key ? node.blocks[key] : undefined;

        if (!value) {
            if (field.required && field.missingMessage) this.fail(field.missingMessage, node.location);
            return;
        }

        if (field.kind === FieldKind.List && value.type !== TokenType.LISTA && field.invalidMessage) {
            this.fail(field.invalidMessage, value.location);
        }

        if (field.kind === FieldKind.MappedLiteral) this.validateMappedLiteral(value, field);
        if (field.kind === FieldKind.MappedList) this.validateMappedList(value, field);
    }

    /**
     * @private
     */
    private validateMappedLiteral (value: ASTNode<T, N>, field: FieldSpec): void {
        const literal = literalStringValue(value);

        if (literal === undefined) {
            if (field.invalidMessage) this.fail(field.invalidMessage, value.location);
            return;
        }

        if (field.mapping?.[literal] === undefined) this.fail(field.unknownMessage!(literal), value.location);
    }

    /**
     * @private
     */
    private validateMappedList (value: ASTNode<T, N>, field: FieldSpec): void {
        if (value.type !== TokenType.LISTA) {
            if (field.invalidMessage) this.fail(field.invalidMessage, value.location);
            return;
        }

        (value as ListNode<T, N>).body.forEach(item => {
            const literal = literalStringValue(item);

            if (literal === undefined) this.fail(field.invalidMessage ?? field.unknownMessage!(''), item.location);
            else if (field.mapping?.[literal] === undefined) this.fail(field.unknownMessage!(literal), item.location);
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
