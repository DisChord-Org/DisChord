import { AnyDataType, ClassDataType, DataType, PrimitiveDataType } from "../model/DataType";
import { PrimitiveType } from "../model/types";
import { CoreLib, CoreLibClass, ResolvedMember } from "./corelib.types";

/**
 * Lookups by name over a `CoreLib`: its classes, the receiver and constructor of each, and the
 * members of a class. Only own keys match: a name like `constructor` or `toString` coming from source
 * code must not resolve to something inherited from `Object.prototype`. {@link CoreLibUtils} adds on
 * top of it the lookups that start from an AST node.
 * @template {string} C - Class names present in the table.
 */
export class CoreLibClasses<C extends string = string> {
    constructor(public readonly corelib: CoreLib<C>) {}

    /**
     * Looks a member up in a class to know its type: every member counts, also the ones a runtime
     * module provides (`usuario.nombre` is a `texto` although it is never rewritten). Methods first and then properties.
     * @param {C} className - Core library class.
     * @param {string} propName - Member name as written in source code.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the class has no such member.
     */
    findMember(className: C, propName: string): ResolvedMember | undefined {
        return this.lookupMember(className, propName, false);
    }

    /**
     * Looks a member up in a class to translate it: the members a runtime module provides are skipped,
     * since the compiler leaves them as written. Methods first and then properties.
     * @param {C} className - Core library class.
     * @param {string} propName - Member name as written in source code.
     * @returns {ResolvedMember | undefined} The member, or `undefined` if the class has no such member.
     */
    findRewritable(className: C, propName: string): ResolvedMember | undefined {
        return this.lookupMember(className, propName, true);
    }

    /**
     * The shared core of {@link findMember} and {@link findRewritable}.
     * @param {boolean} rewritableOnly - Skip the members a runtime module provides: the lookup is made to translate the access, not to know the type.
     * @private
     */
    private lookupMember(className: C, propName: string, rewritableOnly: boolean): ResolvedMember | undefined {
        const classEntry: CoreLibClass = this.corelib.classes[className];
        const qualifiedName = `${className}.${propName}`;

        if (this.hasOwn(classEntry.methods, propName) && !(rewritableOnly && classEntry.methods[propName].runtime)) {
            return {
                qualifiedName,
                member: classEntry.methods[propName],
                isProperty: false
            };
        }

        if (classEntry.properties && this.hasOwn(classEntry.properties, propName) && !(rewritableOnly && classEntry.properties[propName].runtime)) {
            return {
                qualifiedName,
                member: classEntry.properties[propName],
                isProperty: true
            };
        }

        return undefined;
    }

    /**
     * @param {string} name - A class name as written in source code.
     * @returns {string | undefined} The JavaScript constructor of the core library class of that name (`Mapa` → `Map`), or `undefined` if there is none or it can't be instantiated.
     */
    resolveConstructorOf(name: string): string | undefined {
        return this.hasOwn(this.corelib.classes, name) ? this.corelib.classes[name as C].constructs : undefined;
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
     * @param {string} name - A name as written in source code.
     * @returns {boolean} Whether it is the name of a class of the table.
     */
    isClassName(name: string): boolean {
        return this.hasOwn(this.corelib.classes, name);
    }

    /**
     * @param {string} name - A name as written in source code.
     * @returns {boolean} Whether it is the name of a class the compiler puts in scope itself (`cliente`, `canal`), which a program can't declare, except as a parameter.
     */
    isInjectedName(name: string): boolean {
        return this.isClassName(name) && this.corelib.classes[name as C].injected === true;
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
        return [ ...Object.values(PrimitiveType), AnyDataType.Any.format(), ...this.annotableClassNames() ].join(', ');
    }

    /**
     * The classes a `tipo` annotation can name: those whose values have a type of their own, so
     * not `consola` (nothing is an instance of it) nor `Texto` (its values are the primitive `texto`).
     * @returns {C[]} Class names, in declaration order.
     */
    annotableClassNames(): C[] {
        return this.classNames().filter(name => {
            const receiver = this.resolveClassReceiver(name);
            return receiver !== undefined && !(receiver instanceof PrimitiveDataType);
        });
    }

    /**
     * A union belongs to a class only if that class's receiver accepts every member
     * (`texto[]|numero[]` is a `Lista`); a mixed one (`texto|Mapa`) belongs to none, so member lookups on it resolve by name.
     * @param {DataType} type - The type of a value.
     * @returns {C | undefined} The class whose `receiver` accepts it, or `undefined` if it belongs to none.
     */
    classOf(type: DataType): C | undefined {
        return this.classNames().find(key => this.corelib.classes[key].receiver?.isAssignableFrom(type));
    }

    /**
     * @returns {C[]} The names of the classes of the table, in declaration order.
     * @protected
     */
    protected classNames(): C[] {
        return Object.keys(this.corelib.classes) as C[];
    }

    /**
     * @param {object} target - Object to inspect.
     * @param {string} key - Key to look for.
     * @returns {boolean} `true` if `key` is an own key of `target`, ignoring anything inherited.
     */
    protected hasOwn(target: object, key: string): boolean {
        return Object.prototype.hasOwnProperty.call(target, key);
    }
}
