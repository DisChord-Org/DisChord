import { corelib } from "./corelib.data";
import { isIdentificatorNode } from "../ast.guards";
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
