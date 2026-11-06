/**
 * One kind of decision the analyzer keeps by AST node: a node is marked with a value (or just marked,
 * for a yes/no decision) and the generator reads it back. Weakly keyed, so marks die with their nodes.
 */
export class NodeMarks<V = true> {
    private readonly marks: WeakMap<object, V> = new WeakMap();

    /** Records `value` for `node`; with no value, just that the node is marked. */
    public set(node: object, value: V = true as V): void {
        this.marks.set(node, value);
    }

    /** The value recorded for `node`, if any. */
    public get(node: object): V | undefined {
        return this.marks.get(node);
    }

    /** Whether `node` is marked. */
    public has(node: object): boolean {
        return this.marks.has(node);
    }
}
