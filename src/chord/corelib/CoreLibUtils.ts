import { isIdentificatorNode } from "../ast.guards";
import { AnyDataType, ArrayDataType, ClassDataType, DataType, UnionDataType } from "../model/DataType";
import { AccessNode, ASTNode, BaseNode, CallNode, TokenType } from "../model/types";
import { ResolvedMember } from "./corelib.types";
import { CoreLibClasses } from "./CoreLibClasses";

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
export class CoreLibUtils<C extends string = string> extends CoreLibClasses<C> {
    /**
     * Resolves an access whose object is itself a core library class.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the object is not an identifier naming a class, or the class has no such member.
     */
    resolveStatic<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember | undefined {
        if (!isIdentificatorNode(access.object)) return undefined;

        const className = access.object.value;
        if (!this.hasOwn(this.corelib.classes, className)) return undefined;

        return this.findRewritable(className as C, access.property);
    }

    /**
     * Resolves an access on a value of unknown type by looking the name up in
     * every non-static member of every class, in declaration order; the first match wins.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if no class has it as an instance member.
     */
    private resolveInstance<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember | undefined {
        return this.resolveInstanceMembers(access)[0];
    }

    /**
     * Every class's non-static member called `access.property`, in declaration order. Unlike
     * {@link resolveInstance} it doesn't keep only the first one, so a caller that needs to know
     * whether the name is ambiguous across classes can tell.
     * @param {AccessNode<T, N>} access - The access node.
     * @returns {ResolvedMember[]} The matches, empty if no class has it as an instance member.
     */
    resolveInstanceMembers<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>): ResolvedMember[] {
        return this.classNames()
            .map(key => this.findRewritable(key, access.property))
            .filter((found): found is ResolvedMember => found !== undefined && !found.member.static);
    }

    /**
     * The type a call to a member evaluates to: a method's `returns`, or the receiver's own list type for one that `returnsSameList` on a receiver typed as a list. A property yields no type
     * as a call (`texto.longitud()` is not a thing). See {@link findForReturnType} for how the member
     * is found.
     * @param {AccessNode<T, N>} access - The callee of the call.
     * @param {DataType} [receiverType] - The inferred type of `access.object`, if known.
     * @param {boolean} [declaredByUser=false] - Whether a class of the file declares a member named like `access.property`.
     * @returns {DataType | undefined} The type, or `undefined` if there is no such method, its name is ambiguous or the user's declaration wins.
     */
    resolveCallReturnType<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType?: DataType, declaredByUser: boolean = false): DataType | undefined {
        const found = this.findForReturnType(access, receiverType, declaredByUser);
        if (!found || found.isProperty) return undefined;

        return found.member.returnsSameList && receiverType instanceof ArrayDataType ? receiverType : found.member.returns;
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
     * class and only resolves if they all agree on its type. See {@link resolveInstanceMember} for
     * when a member the file declares itself wins.
     * @private
     */
    private findForReturnType<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType: DataType | undefined, declaredByUser: boolean): ResolvedMember | undefined {
        const staticMember = this.resolveStatic(access);
        if (staticMember) return staticMember;

        if (receiverType && !this.isUnknownReceiver(receiverType)) return this.resolveInstanceOf(access, receiverType, true);

        if (declaredByUser) return undefined;

        const [first, ...rest] = this.resolveInstanceMembers(access);
        if (!first || rest.some(other => other.isProperty !== first.isProperty || other.member.returns !== first.member.returns)) return undefined;

        return first;
    }

    /**
     * @param {ASTNode<T, N>} callee - What is being called.
     * @param {{ lookup(name: string): unknown }} symbols - The file's symbol table, with the scope of the call open. A function, variable or parameter it declares under that name, visible at the call, wins over the core library function, so the name is not mapped.
     * @returns {string | undefined} The callee it is transpiled to, or `undefined` if it isn't a plain name the core library maps or the user's declaration wins.
     */
    resolveFunction<T extends string, N extends BaseNode<T>> (callee: ASTNode<T, N>, symbols: { lookup(name: string): unknown }): string | undefined {
        if (!isIdentificatorNode(callee) || !this.hasOwn(this.corelib.functions, callee.value)) return undefined;
        if (symbols.lookup(callee.value)) return undefined;

        return this.corelib.functions[callee.value];
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
        if (receiverType && !this.isUnknownReceiver(receiverType)) return this.resolveInstanceOf(access, receiverType, false);
        if (declaredByUser && !this.resolveStatic(access)) return undefined;

        return this.resolveInstance(access);
    }

    /**
     * @param {ASTNode<T, N>} target - What follows `nuevo`: a class name, called (`Mapa()`) or not.
     * @returns {string | undefined} The JavaScript constructor it is emitted as (`Mapa` → `Map`), or `undefined` if it isn't an instantiable core library class.
     */
    resolveConstructor<T extends string, N extends BaseNode<T>> (target: ASTNode<T, N>): string | undefined {
        const name = this.instantiatedName(target);
        return name === undefined ? undefined : this.resolveConstructorOf(name);
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

    /**
     * @param {boolean} forType - Whether the member is wanted for its type (every member) or to translate it (the rewritable ones).
     * @private
     */
    private resolveInstanceOf<T extends string, N extends BaseNode<T>> (access: AccessNode<T, N>, receiverType: DataType, forType: boolean): ResolvedMember | undefined {
        const className = this.classOf(receiverType);
        const found = className && (forType ? this.findMember(className, access.property) : this.findRewritable(className, access.property));

        return found && !found.member.static ? found : undefined;
    }

    private instantiatedName<T extends string, N extends BaseNode<T>> (target: ASTNode<T, N>): string | undefined {
        const callee = target.type === TokenType.LLAMADA ? (target as CallNode<T, N>).object : target;
        return isIdentificatorNode(callee) ? callee.value : undefined;
    }
}
