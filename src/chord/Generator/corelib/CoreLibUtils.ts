import { ClassesEnum, corelib } from "./corelib.data";
import { AccessNode, BaseNode, IdentificatorNode, TokenType } from "../../types";
import { CoreLibClass, ResolvedMember } from "./corelib.types";

/**
 * Read-only lookups over `corelib`, so callers pass the raw names they have from the AST and
 * don't index its nested records by hand. All lookups only match own keys: a name like
 * `constructor` or `toString` coming from source code must not resolve to something inherited
 * from `Object.prototype`.
 */
export class CoreLibUtils {
    /**
     * Resolves an access whose object is itself a core library class.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the object is not an identifier naming a class, or the class has no such member.
     */
    static resolveStatic<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember | undefined {
        const objName = CoreLibUtils.getObjectName(access);
        if (!objName) return undefined;

        const className = CoreLibUtils.resolveClass(objName);
        if (className === undefined) return undefined;

        return CoreLibUtils.findInClass(className, access.property);
    }

    /**
     * Resolves an access on a value of unknown type by looking the name up in
     * every non-static member of every class, in declaration order; the first match wins.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if no class has it as an instance member.
     */
    static resolveInstance<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember | undefined {
        for (const key of Object.keys(corelib.classes)) {
            const found = CoreLibUtils.findInClass(Number(key) as ClassesEnum, access.property);

            if (found && !found.member.static) return found;
        }

        return undefined;
    }

    /**
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {string | null} The name of the accessed object, or `null` if it is not an identifier.
     */
    private static getObjectName<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): string | null {
        if (access.object.type !== TokenType.IDENTIFICADOR) return null;

        return (access.object as unknown as IdentificatorNode<T>).value;
    }

    /**
     * Numeric enums also map `"0"`, `"1"`... back to names, which must not count as classes.
     * @param {string} name - Class name as written in source code.
     * @returns {ClassesEnum | undefined} The enum value, or `undefined` if it is not a core library class.
     */
    private static resolveClass(name: string): ClassesEnum | undefined {
        if (!CoreLibUtils.hasOwn(ClassesEnum, name) || !Number.isNaN(Number(name))) return undefined;

        return ClassesEnum[name as keyof typeof ClassesEnum];
    }

    /**
     * Looks a member up in a class, methods first and then properties.
     * @param {ClassesEnum} className - Core library class.
     * @param {string} propName - Member name as written in source code.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the class has no such member.
     */
    private static findInClass(className: ClassesEnum, propName: string): ResolvedMember | undefined {
        const classEntry: CoreLibClass = corelib.classes[className];
        const qualifiedName = `${ClassesEnum[className]}.${propName}`;

        if (CoreLibUtils.hasOwn(classEntry.methods, propName)) {
            return { qualifiedName, member: classEntry.methods[propName], isProperty: false };
        }

        if (classEntry.properties && CoreLibUtils.hasOwn(classEntry.properties, propName)) {
            return { qualifiedName, member: classEntry.properties[propName], isProperty: true };
        }

        return undefined;
    }

    /**
     * @param {object} target - Object to inspect.
     * @param {string} key - Key to look for.
     * @returns {boolean} `true` if `key` is an own key of `target`, ignoring anything inherited.
     */
    private static hasOwn(target: object, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
}
