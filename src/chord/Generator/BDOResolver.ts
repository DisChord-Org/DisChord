import { BDOSchema, fieldKeys, FieldKind, FieldSpec, JSFallback, literalStringValue } from "../BDOSchema";
import { ASTNode, BaseNode, ListNode, ODBNode, TokenType } from "../types";

/**
 * Resolves a BDO against a {@link BDOSchema} — the Generator-side interpreter of the same schema
 * `chord/Analyzer/BDOValidator` validates against. A `SubGenerator` constructs one bound to how it
 * visits an expression, then calls {@link resolve} with the node and its schema to get back every
 * field's generated JS value in one call, instead of a `resolveX`/`getX` method per field that
 * re-reads the same property the Analyzer already validated. By the time this runs, a field's shape
 * is already guaranteed by the Analyzer, so unlike `BDOValidator` this never fails — an
 * unresolvable field (absent, or shaped in a way its `kind` can't translate) just falls back to
 * `field.default`.
 * @template {string} T - Token extensions vector.
 * @template {BaseNode<T>} N - Node extensions vector.
 */
export class BDOResolver<T extends string, N extends BaseNode<T>> {
    /**
     * @param visit - Renders an expression node to its generated JS source — normally the parent
     * `Generator`'s own `visit`.
     */
    constructor (private readonly visit: (node: ASTNode<T, N>) => string) {}

    /**
     * Resolves every field `schema` declares against `node`.
     * @param {ODBNode<T, N>} node - The BDO to resolve.
     * @param {BDOSchema<T, N>} schema - The schema describing `node`'s fields.
     * @returns {Record<string, string>} Each field's generated JS value, keyed by `field.key`
     * (its first key, when `field.key` names synonyms).
     */
    public resolve (node: ODBNode<T, N>, schema: BDOSchema<T, N>): Record<string, string> {
        const result: Record<string, string> = {};
        schema.fields.forEach(field => { result[fieldKeys(field.key)[0]] = this.resolveField(node, field); });
        return result;
    }

    /**
     * @private
     */
    private resolveField (node: ODBNode<T, N>, field: FieldSpec): string {
        const key = fieldKeys(field.key).find(candidate => node.blocks[candidate]);
        const value = key ? node.blocks[key] : undefined;

        if (!value) return field.default ?? (field.kind === FieldKind.MappedList ? JSFallback.EmptyArray : JSFallback.Undefined);

        switch (field.kind) {
            case FieldKind.Value:
            case FieldKind.List:
                return this.visit(value);
            case FieldKind.MappedLiteral:
                return this.resolveMappedLiteral(value, field);
            case FieldKind.MappedList:
                return this.resolveMappedList(value, field);
        }
    }

    /**
     * @private
     */
    private resolveMappedLiteral (value: ASTNode<T, N>, field: FieldSpec): string {
        const literal = literalStringValue(value);
        const mapped = literal !== undefined ? field.mapping?.[literal] : undefined;

        return mapped !== undefined ? `${mapped}` : field.default ?? JSFallback.Undefined;
    }

    /**
     * @private
     */
    private resolveMappedList (value: ASTNode<T, N>, field: FieldSpec): string {
        if (value.type !== TokenType.LISTA) return field.default ?? JSFallback.EmptyArray;

        const items = (value as ListNode<T, N>).body.map(item => {
            const literal = literalStringValue(item);
            return literal !== undefined ? field.mapping?.[literal] : undefined;
        });

        return `[ ${items.join(', ')} ]`;
    }
}
