import { NodeMarks } from "./NodeMarks";

/**
 * How a method call on a receiver of union type is emitted, when it isn't by the member's name:
 * as a call to `member` on the receiver, or as a call to the runtime helper `helper` with the
 * receiver as its first argument.
 */
export type CallDispatch = { readonly member: string } | { readonly helper: string };

/**
 * What the analyzer decided about how to emit the nodes of the tree, kept by node so the generator
 * only has to read it — the analyzer decides, the generator translates. Each decision is a
 * {@link NodeMarks} the analyzer writes with `set` and the generator reads with `get`/`has`.
 */
export class CompilationMarks {
    /** Calls the analyzer decided must be awaited. */
    public readonly awaited = new NodeMarks();

    /**
     * The name each member access is emitted with: the JavaScript name of the core library member
     * it stands for, or the name as written when it doesn't (a field, a member of the user).
     */
    public readonly members = new NodeMarks<string>();

    /**
     * The runtime helper a property read is emitted through (`chordLongitud(p)`, which picks at run
     * time) instead of as `receiver.name`.
     */
    public readonly memberHelpers = new NodeMarks<string>();

    /** Calls on a receiver of union type that the analyzer decided to emit differently. */
    public readonly dispatches = new NodeMarks<CallDispatch>();

    /**
     * Expressions of an interpolated text that are a `booleano`, so they are emitted as
     * `verdadero`/`falso` and not as `true`/`false`.
     */
    public readonly booleans = new NodeMarks();
}
