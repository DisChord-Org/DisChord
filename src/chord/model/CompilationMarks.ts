/**
 * How a method call on a receiver of union type is emitted, when it isn't by the member's name:
 * as a call to `member` on the receiver, or as a call to the runtime helper `helper` with the
 * receiver as its first argument.
 */
export type CallDispatch = { readonly member: string } | { readonly helper: string };

/**
 * What the analyzer decided about how to emit the nodes of the tree, kept by node so the generator
 * only has to read it — the analyzer decides, the generator translates.
 */
export class CompilationMarks {
    /**
     * Calls the analyzer decided must be awaited (see {@link markAwaited}).
     */
    private readonly awaitedCalls: WeakSet<object> = new WeakSet();

    /**
     * The name each member access is emitted with (see {@link markMember}).
     */
    private readonly memberNames: WeakMap<object, string> = new WeakMap();

    /**
     * The runtime helper a property read is emitted through (see {@link markMemberHelper}).
     */
    private readonly memberHelpers: WeakMap<object, string> = new WeakMap();

    /**
     * Calls on a receiver of union type that the analyzer decided to emit differently (see
     * {@link markDispatched}).
     */
    private readonly dispatchedCalls: WeakMap<object, CallDispatch> = new WeakMap();

    /**
     * Records that the analyzer decided this call must be awaited, so the generator only has to
     * read the decision.
     *
     * @param {object} call - The call node.
     */
    public markAwaited(call: object): void {
        this.awaitedCalls.add(call);
    }

    /**
     * @param {object} call - The call node.
     * @returns {boolean} Whether the analyzer decided this call must be awaited.
     */
    public isAwaited(call: object): boolean {
        return this.awaitedCalls.has(call);
    }

    /**
     * Records the name a member access is emitted with: the JavaScript name of the core library
     * member it stands for, or the name as written when it doesn't (a field, a member of the user).
     *
     * @param {object} access - The access node.
     * @param {string} name - The final property name.
     */
    public markMember(access: object, name: string): void {
        this.memberNames.set(access, name);
    }

    /**
     * @param {object} access - The access node.
     * @returns {string | undefined} The name the analyzer decided to emit the access with, if it did.
     */
    public memberOf(access: object): string | undefined {
        return this.memberNames.get(access);
    }

    /**
     * Records that a property read is emitted as a call to a runtime helper taking the receiver
     * (`chordLongitud(p)`), which picks at run time, instead of as `receiver.name`.
     *
     * @param {object} access - The access node.
     * @param {string} helper - The helper's name.
     */
    public markMemberHelper(access: object, helper: string): void {
        this.memberHelpers.set(access, helper);
    }

    /**
     * @param {object} access - The access node.
     * @returns {string | undefined} The helper the analyzer decided to emit the read through, if it did.
     */
    public memberHelperOf(access: object): string | undefined {
        return this.memberHelpers.get(access);
    }

    /**
     * Records how the analyzer decided to emit a method call on a receiver of union type, so the
     * generator only has to read the decision.
     *
     * @param {object} call - The call node.
     * @param {CallDispatch} dispatch - What it is emitted as.
     */
    public markDispatched(call: object, dispatch: CallDispatch): void {
        this.dispatchedCalls.set(call, dispatch);
    }

    /**
     * @param {object} call - The call node.
     * @returns {CallDispatch | undefined} How the analyzer decided to emit this call, if it did.
     */
    public dispatchOf(call: object): CallDispatch | undefined {
        return this.dispatchedCalls.get(call);
    }
}
