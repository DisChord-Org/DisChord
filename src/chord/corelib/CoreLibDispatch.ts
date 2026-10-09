import { UnionDataType, UserClassDataType } from "../model/DataType";
import { AccessNode, BaseNode } from "../types";
import { CoreLibUtils } from "./CoreLibUtils";
import { runtimeHelperNames } from "./runtimeHelpers";

/**
 * What a method call on a receiver of union type is emitted as: a call to `member`, or to the runtime
 * helper `helper` with the receiver as its first argument.
 */
export type UnionDispatch = { readonly member: string } | { readonly helper: string };

/**
 * The policy for emitting a method call when its receiver is ambiguous (a union, `cualquiera` or no
 * type): which member or runtime helper stands for the name. It is built over the `CoreLibUtils`
 * whose table it reads, so a layer on top of chord can use it with its own (merged) one.
 * @template {string} C - Class names present in the table.
 */
export class CoreLibDispatch<C extends string = string> {
    constructor(private readonly utils: CoreLibUtils<C>) {}

    /**
     * Decides how a method called on a receiver of union type is emitted, by resolving the class of
     * every member of the union. If they all map the name to the same JavaScript member, that member
     * is called directly (`Mapa|Conjunto` and `tiene` give `has`). If they differ, the name is
     * ambiguous at compile time and the choice is made at run time by the runtime helper named
     * `chord<Name>` (`chordTiene`), which exists only for the names that need one. A member of the
     * union that is a class of the file counts as one that maps the name to itself, so the helper
     * delegates to its own method.
     *
     * Anything else yields `undefined`, leaving the call as if the receiver were of unknown type: a
     * member that isn't a class (`indefinido`) or lacks the method, a property, a name with no helper,
     * or a union with no core library class at all. Only calls are decided: reading `c.tiene` without
     * calling it is never rewritten.
     * @param {AccessNode<T, N>} access - The callee of the call.
     * @param {UnionDataType} union - The inferred type of its receiver.
     * @param {(className: string) => boolean} declaresMethod - Whether a class of the file declares the method.
     * @returns {UnionDispatch | undefined} What the call is emitted as, or `undefined` to leave it alone.
     */
    resolveUnionDispatch<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, union: UnionDataType, declaresMethod: (className: string) => boolean): UnionDispatch | undefined {
        const transpiles = new Set<string>();
        let hasUserClass = false;

        for (const member of union.members) {
            if (member instanceof UserClassDataType) {
                if (!declaresMethod(member.name)) return undefined;
                hasUserClass = true;
                continue;
            }

            const className = this.utils.classOf(member);
            const found = className && this.utils.findInClass(className, access.property);
            if (!found || found.member.static || found.isProperty) return undefined;

            transpiles.add(found.member.transpile);
        }

        if (transpiles.size === 0) return undefined;

        if (hasUserClass) transpiles.add(access.property);
        if (transpiles.size === 1) return hasUserClass ? undefined : { member: [ ...transpiles ][0] };

        return this.dispatchHelper(access.property);
    }

    /**
     * Decides how a method called on a receiver of unknown type (no type, or `cualquiera`) is emitted
     * when the name means different members in different classes (`tiene` is `includes` in `Texto` and
     * `Lista` but `has` in `Mapa` and `Conjunto`): through the runtime helper that picks at run time.
     * The ambiguity is computed over the table. A member a class of the file declares under that name
     * doesn't prevent it, since the helper calls the receiver's own method when it has one.
     * @param {AccessNode<T, N>} access - The callee of the call.
     * @returns {UnionDispatch | undefined} The helper, or `undefined` if the name is not ambiguous, is a property, or has no helper.
     */
    resolveUnknownDispatch<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): UnionDispatch | undefined {
        const members = this.utils.resolveInstanceMembers(access);
        if (members.some(found => found.isProperty)) return undefined;
        if (new Set(members.map(found => found.member.transpile)).size < 2) return undefined;

        return this.dispatchHelper(access.property);
    }

    /**
     * Decides how a property read on a receiver of unknown type is emitted when the name means a
     * core library property (`longitud`, `tamano`): through the runtime helper that picks at run time,
     * since an object can hold a field of that name (a `bdo` read from anywhere) and the receiver's type
     * can't say. Only names whose every member in the table is a property, and that have a helper.
     * @param {AccessNode<T, N>} access - The property read.
     * @returns {UnionDispatch | undefined} The helper, or `undefined` if the name is no property of the core library or has no helper.
     */
    resolveUnknownPropertyDispatch<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): UnionDispatch | undefined {
        const members = this.utils.resolveInstanceMembers(access);
        if (members.length === 0 || members.some(found => !found.isProperty)) return undefined;

        return this.dispatchHelper(access.property);
    }

    private dispatchHelper (property: string): UnionDispatch | undefined {
        const helper = `chord${property.charAt(0).toUpperCase()}${property.slice(1)}`;
        return runtimeHelperNames.has(helper) ? { helper } : undefined;
    }
}
