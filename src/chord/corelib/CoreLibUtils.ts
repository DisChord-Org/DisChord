// if this file exceeds 500 lines of code, it will be refactored

import { isIdentificatorNode } from "../ast.guards";
import { AnyDataType, ClassDataType, DataType, PrimitiveDataType, UnionDataType } from "../model/DataType";
import { AccessNode, ASTNode, BaseNode, CallNode, PrimitiveType, TokenType } from "../types";
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
     * The type a call to a member evaluates to: a method's `returns`. A property yields no type
     * as a call (`texto.longitud()` is not a thing). See {@link findForReturnType} for how the member
     * is found.
     * @param {AccessNode<T, N>} access - The callee of the call.
     * @param {DataType} [receiverType] - The inferred type of `access.object`, if known.
     * @param {boolean} [declaredByUser=false] - Whether a class of the file declares a member named like `access.property`.
     * @returns {DataType | undefined} The type, or `undefined` if there is no such method, its name is ambiguous or the user's declaration wins.
     */
    resolveCallReturnType<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType?: DataType, declaredByUser: boolean = false): DataType | undefined {
        const found = this.findForReturnType(access, receiverType, declaredByUser);
        return found && !found.isProperty ? found.member.returns : undefined;
    }

    /**
     * The type reading a member evaluates to: a property's `returns`. A method yields no type as a
     * plain read (`fecha.dia` without calling it). See {@link findForReturnType} for how the member
     * is found.
     * @param {AccessNode<T, N>} access - The access node, not the callee of a call.
     * @param {DataType} [receiverType] - The inferred type of `access.object`, if known.
     * @param {boolean} [declaredByUser=false] - Whether a class of the file declares a member named like `access.property`.
     * @returns {DataType | undefined} The type, or `undefined` if there is no such property, its name is ambiguous or the user's declaration wins.
     */
    resolvePropertyType<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType?: DataType, declaredByUser: boolean = false): DataType | undefined {
        const found = this.findForReturnType(access, receiverType, declaredByUser);
        return found?.isProperty ? found.member.returns : undefined;
    }

    /**
     * The member an access stands for, when it has a type: a static member, or an instance one.
     * When the receiver's type is known the member is looked up only in the class that type belongs
     * to (`texto.cortar` is `Texto.cortar`, never `Lista.cortar`), and there is none if that class
     * has no such member or the type belongs to no class (a `bdo`'s own fields, a `booleano`):
     * guessing there would type a user's field after a core library one that happens to share its
     * name. With no receiver type (or `cualquiera`), falls back to looking the name up in every
     * class and only resolves if they all agree on its type instance. A member the file itself declares in a
     * class (`declaredByUser`) wins over the core library one of the same name when the receiver's
     * type is unknown, so the name is left to the user's declaration. A known receiver type or a
     * static access is unaffected: the receiver decides once it is known. Classes imported from
     * another file aren't seen by the caller, so a member they declare is still resolved by name.
     * @private
     */
    private findForReturnType<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType: DataType | undefined, declaredByUser: boolean): ResolvedMember | undefined {
        const staticMember = this.resolveStatic(access);
        if (staticMember) return staticMember;

        if (receiverType && !this.isUnknownReceiver(receiverType)) return this.resolveInstanceOf(access, receiverType);

        if (declaredByUser) return undefined;

        const [first, ...rest] = this.resolveInstanceMembers(access);
        if (!first || rest.some(other => other.isProperty !== first.isProperty || other.member.returns !== first.member.returns)) return undefined;

        return first;
    }

    /**
     * @param {ASTNode<T, N>} callee - What is being called.
     * @param {boolean} [declaredByUser=false] - Whether the file declares something of that name (a function, variable or parameter) that is visible at the call. It wins, so the name is not mapped.
     * @returns {string | undefined} The callee it is transpiled to, or `undefined` if it isn't a plain name the core library maps or the user's declaration wins.
     */
    resolveFunction<T extends string, N extends BaseNode<T>> (callee: ASTNode<T, N>, declaredByUser: boolean = false): string | undefined {
        if (declaredByUser) return undefined;

        return isIdentificatorNode(callee) && this.hasOwn(this.corelib.functions, callee.value) ? this.corelib.functions[callee.value] : undefined;
    }

    /**
     * Looks a member up in a class, methods first and then properties. Members provided by a runtime module are skipped.
     * @param {C} className - Core library class.
     * @param {string} propName - Member name as written in source code.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the class has no such member.
     */
    findInClass(className: C, propName: string): ResolvedMember | undefined {
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
     * Resolves an instance member the way the generator needs it: through the class the receiver's
     * type belongs to when that type is known (a member of another class sharing the name, or a
     * field of a `bdo` that happens to be called like one, is never picked up), and otherwise, like
     * {@link resolveInstance}, by name across every class. A member the file itself declares in a
     * class (`declaredByUser`) wins over the core library one of the same name when the receiver's
     * type is unknown, so the name is left to the user's declaration. A known receiver type or a
     * static access is unaffected: the receiver decides once it is known. Classes imported from
     * another file aren't seen by the caller, so a member they declare is still resolved by name.
     * @param {AccessNode<T, N>} access - The access node.
     * @param {DataType} [receiverType] - The inferred type of `access.object`, if known.
     * @param {boolean} [declaredByUser=false] - Whether a class of the file declares a member named like `access.property`.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if there is none or the user's declaration wins.
     */
    resolveInstanceMember<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType?: DataType, declaredByUser: boolean = false): ResolvedMember | undefined {
        if (receiverType && !this.isUnknownReceiver(receiverType)) return this.resolveInstanceOf(access, receiverType);
        if (declaredByUser && !this.resolveStatic(access)) return undefined;

        return this.resolveInstance(access);
    }

    /**
     * @param {ASTNode<T, N>} target - What follows `nuevo`: a class name, called (`Mapa()`) or not.
     * @returns {string | undefined} The JavaScript constructor it is emitted as (`Mapa` → `Map`), or `undefined` if it isn't an instantiable core library class.
     */
    resolveConstructor<T extends string, N extends BaseNode<T>> (target: ASTNode<T, N>): string | undefined {
        const name = this.instantiatedName(target);
        return name !== undefined && this.hasOwn(this.corelib.classes, name) ? this.corelib.classes[name as C].constructs : undefined;
    }

    /**
     * @param {ASTNode<T, N>} target - What follows `nuevo`: a class name, called (`Mapa()`) or not.
     * @returns {ClassDataType | undefined} The type of the instance it creates, or `undefined` if it isn't a core library class typed by its class.
     */
    resolveConstructedType<T extends string, N extends BaseNode<T>> (target: ASTNode<T, N>): ClassDataType | undefined {
        const name = this.instantiatedName(target);
        return name === undefined ? undefined : this.resolveClassType(name);
    }

    /**
     * @param {string} name - Class name as written in source code.
     * @returns {ClassDataType | undefined} The type of an instance of that class, or `undefined` if it isn't a core library class whose instances are typed by their class (`Texto` has a primitive instead).
     */
    resolveClassType(name: string): ClassDataType | undefined {
        if (!this.hasOwn(this.corelib.classes, name)) return undefined;

        const receiver = this.corelib.classes[name as C].receiver;
        return receiver instanceof ClassDataType ? receiver : undefined;
    }

    /**
     * @param {string} name - Class name as written in a `tipo` annotation.
     * @returns {DataType | undefined} What a value of that class is typed as (`Lista` is `cualquiera[]`), or `undefined` if it isn't a core library class with a receiver.
     */
    resolveClassReceiver(name: string): DataType | undefined {
        return this.hasOwn(this.corelib.classes, name) ? this.corelib.classes[name as C].receiver : undefined;
    }

    /**
     * The names that can be written after `tipo` (or `->`) without declaring anything: the primitives,
     * `cualquiera`, and the core library classes that are a type of their own (`Mapa`, `Lista`...). A
     * class that is just another spelling of a primitive (`Texto`, `Numero`, `BDO`) and one with only
     * static members (`Mates`, `JSON`, `consola`) are not in it. Derived from the real tables, so a
     * message listing them can't drift from what is accepted.
     * @returns {string} The names, separated by commas.
     */
    annotableTypeNames(): string {
        const classes = (Object.keys(this.corelib.classes) as C[]).filter(name => {
            const receiver = this.resolveClassReceiver(name);
            return receiver !== undefined && !(receiver instanceof PrimitiveDataType);
        });

        return [ ...Object.values(PrimitiveType), AnyDataType.Any.format(), ...classes ].join(', ');
    }

    /**
     * A union belongs to a class only if that class's receiver accepts every member
     * (`texto[]|numero[]` is a `Lista`); a mixed one (`texto|Mapa`) belongs to none, so member lookups on it resolve by name.
     * @param {DataType} type - The type of a value.
     * @returns {C | undefined} The class whose `receiver` accepts it, or `undefined` if it belongs to none.
     */
    classOf(type: DataType): C | undefined {
        return (Object.keys(this.corelib.classes) as C[]).find(key => this.corelib.classes[key].receiver?.isAssignableFrom(type));
    }

    /**
     * Whether a receiver type tells nothing about which class the member belongs to, so the member
     * is resolved by name as with no type at all: `cualquiera`, or a union (which has no single
     * class). Provisional: a union stays unknown until receivers of a union type get their own
     * resolution.
     * @param {DataType} type - The inferred type of the receiver.
     * @returns {boolean} `true` if the receiver has to be treated as unknown.
     */
    private isUnknownReceiver(type: DataType): boolean {
        return type instanceof AnyDataType || type instanceof UnionDataType;
    }

    private resolveInstanceOf<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType: DataType): ResolvedMember | undefined {
        const className = this.classOf(receiverType);
        const found = className && this.findInClass(className, access.property);

        return found && !found.member.static ? found : undefined;
    }

    private instantiatedName<T extends string, N extends BaseNode<T>> (target: ASTNode<T, N>): string | undefined {
        const callee = target.type === TokenType.LLAMADA ? (target as CallNode<T, N>).object : target;
        return isIdentificatorNode(callee) ? callee.value : undefined;
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
