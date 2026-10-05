import { corelib } from "./corelib.data";
import { isIdentificatorNode } from "../ast.guards";
import { DataType } from "../DataType";
import { AccessNode, BaseNode } from "../types";
import { CoreLib, CoreLibClass, ResolvedMember } from "./corelib.types";

/**
 * Read-only lookups over a `CoreLib`, so callers pass the raw names they have from the AST and
 * don't index its nested records by hand. All lookups only match own keys: a name like
 * `constructor` or `toString` coming from source code must not resolve to something inherited
 * from `Object.prototype`.
 *
 * It is built over the table it is given, so a layer on top of chord can extend it with its own
 * (merged) table and have the shared visitors use that one.
 * @template {string} C - Class names present in the table.
 */
export class CoreLibUtils<C extends string = string> {
    constructor(protected readonly corelib: CoreLib<C>) {}

    /**
     * Resolves an access whose object is itself a core library class.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the object is not an identifier naming a class, or the class has no such member.
     */
    resolveStatic<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember | undefined {
        if (!isIdentificatorNode(access.object)) return undefined;

        const className = access.object.value;
        if (!this.hasOwn(this.corelib.classes, className)) return undefined;

        return this.findInClass(className as C, access.property);
    }

    /**
     * Resolves an access on a value of unknown type by looking the name up in
     * every non-static member of every class, in declaration order; the first match wins.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if no class has it as an instance member.
     */
    resolveInstance<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember | undefined {
        for (const key of Object.keys(this.corelib.classes)) {
            const found = this.findInClass(key as C, access.property);

            if (found && !found.member.static) return found;
        }

        return undefined;
    }

    /**
     * Every class's non-static member called `access.property`, in declaration order. Unlike
     * {@link resolveInstance} it doesn't stop at the first one, so a caller that needs to know
     * whether the name is ambiguous across classes can tell.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember[]} The matches, empty if no class has it as an instance member.
     */
    resolveInstanceMembers<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember[] {
        return Object.keys(this.corelib.classes)
            .map(key => this.findInClass(key as C, access.property))
            .filter((found): found is ResolvedMember => found !== undefined && !found.member.static);
    }

    /**
     * The type an access evaluates to: a static member's own `returns`, or an instance member's when
     * every class with a member of that name agrees on it (a value's class isn't known yet, so a
     * name like `tiene`, which several classes define, only resolves if they all return the same
     * type instance). A method yields its type only as a call, and a property only as a plain access.
     * @param {AccessNode<T, N>} access - The access node.
     * @param {boolean} isCall - Whether the access is the callee of a call.
     * @returns {DataType | undefined} The type, or `undefined` if the core library has no such
     * member, its name is ambiguous, or it is used the wrong way (a method read without calling it).
     */
    resolveReturnType<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, isCall: boolean): DataType | undefined {
        const staticMember = this.resolveStatic(access);
        if (staticMember) return this.returnTypeOf(staticMember, isCall);

        const [first, ...rest] = this.resolveInstanceMembers(access);
        if (!first || rest.some(other => other.isProperty !== first.isProperty || other.member.returns !== first.member.returns)) return undefined;

        return this.returnTypeOf(first, isCall);
    }

    /**
     * @param {string} name - Function name as written in source code.
     * @returns {string | undefined} The callee it is transpiled to, or `undefined` if the core library doesn't map it.
     */
    resolveFunction(name: string): string | undefined {
        return this.hasOwn(this.corelib.functions, name) ? this.corelib.functions[name] : undefined;
    }

    /**
     * Looks a member up in a class, methods first and then properties. Members provided by a runtime module are skipped.
     * @param {C} className - Core library class.
     * @param {string} propName - Member name as written in source code.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the class has no such member.
     */
    private findInClass(className: C, propName: string): ResolvedMember | undefined {
        const classEntry: CoreLibClass = this.corelib.classes[className];
        const qualifiedName = `${className}.${propName}`;

        if (this.hasOwn(classEntry.methods, propName) && !classEntry.methods[propName].runtime) {
            return {
                qualifiedName,
                member: classEntry.methods[propName],
                isProperty: false
            };
        }

        if (classEntry.properties && this.hasOwn(classEntry.properties, propName) && !classEntry.properties[propName].runtime) {
            return {
                qualifiedName,
                member: classEntry.properties[propName],
                isProperty: true
            };
        }

        return undefined;
    }

    private returnTypeOf(resolved: ResolvedMember, isCall: boolean): DataType | undefined {
        return resolved.isProperty === isCall ? undefined : resolved.member.returns;
    }

    /**
     * @param {object} target - Object to inspect.
     * @param {string} key - Key to look for.
     * @returns {boolean} `true` if `key` is an own key of `target`, ignoring anything inherited.
     */
    private hasOwn(target: object, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
}

/**
 * Lookups over chord's own `corelib`; the default used by the shared visitors and rules.
 * @type {CoreLibUtils}
 */
export const coreLibUtils = new CoreLibUtils(corelib);
