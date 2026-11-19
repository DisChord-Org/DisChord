import { Symbol } from "./types";

type ClassEntry = { superClass?: string; members: ReadonlyMap<string, Symbol> };

/**
 * The classes declared in the file, by name: each one's parent class and the members it declares
 * itself, so a member can be found from a class name and through inheritance.
 */
export class ClassRegistry {
    private readonly classes: Map<string, ClassEntry> = new Map();

    /**
     * Records a class being declared.
     *
     * @param {string} name - The class name.
     * @param {ReadonlyMap<string, Symbol>} members - The symbols its body declares.
     * @param {string} [superClass] - The name of the class it extends, if any.
     */
    public register(name: string, members: ReadonlyMap<string, Symbol>, superClass?: string): void {
        this.classes.set(name, { superClass, members });
    }

    /**
     * @param {string} name - A class name.
     * @returns {boolean} Whether a class with that name is declared in the file.
     */
    public isUserClass(name: string): boolean {
        return this.classes.has(name);
    }

    /**
     * @param {string} name - A user class name.
     * @returns {string | undefined} The class it extends, if any.
     */
    public superClassOf(name: string): string | undefined {
        return this.classes.get(name)?.superClass;
    }

    /**
     * Finds a member in a user class, searching its parent classes in turn. A parent that isn't a
     * class of this file ends the search, since what it holds is unknown.
     *
     * @param {string} className - A user class name.
     * @param {string} member - The member name.
     * @returns {Symbol | undefined} The member, or `undefined` if it isn't found in the chain.
     */
    public findMember(className: string, member: string): Symbol | undefined {
        return this.walk(className, member, ClassRegistry.memberOf);
    }

    /**
     * @param {string} className - A class name.
     * @param {string} member - The member name.
     * @returns {Symbol | undefined} The member only if that class declares it itself, not a parent.
     */
    public ownMember(className: string, member: string): Symbol | undefined {
        return this.classes.get(className)?.members.get(member);
    }

    /**
     * The class and then each class it extends in turn, as long as they are classes of this file: a
     * parent that isn't one ends the chain, and so does a cycle (a class is never listed twice).
     *
     * @param {string} className - A class name.
     * @returns {string[]} The user class names, starting with `className` itself.
     */
    public chainOf(className: string): string[] {
        const chain: string[] = [];

        this.walk(className, chain, ClassRegistry.collect);

        return chain;
    }

    /**
     * @param {string} sub - A class name.
     * @param {string} base - A class name.
     * @returns {boolean} Whether `sub` is `base` or extends it, directly or through other classes. A cycle in the chain is cut.
     */
    public isSubclassOf(sub: string, base: string): boolean {
        return this.walk(sub, base, ClassRegistry.isBase) === true;
    }

    /**
     * The one walk up the superclass chain, shared by every query: calls `probe` on `start` and then
     * on each class it extends, until `probe` answers something, a parent isn't a class of this file
     * or the chain is cut. `probe` is a function that captures nothing, taking what it needs as `arg`,
     * so a query allocates nothing.
     *
     * @param {string} start - A class name.
     * @param {A} arg - Whatever the probe needs.
     * @param probe - Called with each name and its entry (`undefined` if it isn't a class of this file); a result other than `undefined` ends the walk.
     * @returns {R | undefined} What the probe answered, or `undefined` if it never did.
     */
    private walk<A, R>(start: string, arg: A, probe: (name: string, entry: ClassEntry | undefined, arg: A) => R | undefined): R | undefined {
        let current: string | undefined = start;

        // a chain longer than the classes of the file (plus an unregistered `start`) passes through one twice: it is a cycle
        for (let steps = this.classes.size + 1; current !== undefined && steps > 0; steps--) {
            const entry = this.classes.get(current);
            const result = probe(current, entry, arg);

            if (result !== undefined || !entry) return result;

            current = entry.superClass;
        }

        return undefined;
    }

    private static memberOf(_name: string, entry: ClassEntry | undefined, member: string): Symbol | undefined {
        return entry?.members.get(member);
    }

    private static isBase(name: string, _entry: ClassEntry | undefined, base: string): true | undefined {
        return name === base ? true : undefined;
    }

    /** Lists `name` into `chain`, ending the walk (`true`) on one already listed: that is a cycle. */
    private static collect(name: string, entry: ClassEntry | undefined, chain: string[]): true | undefined {
        if (!entry || chain.includes(name)) return true;

        chain.push(name);

        return undefined;
    }

    /**
     * @param {string} member - A member name.
     * @returns {Symbol[]} The member as declared by each class of the file that declares it itself.
     */
    public membersNamed(member: string): Symbol[] {
        return [...this.classes.values()]
            .map(entry => entry.members.get(member))
            .filter((symbol): symbol is Symbol => symbol !== undefined);
    }

    /**
     * @param {string} member - A member name.
     * @returns {boolean} Whether any class of the file declares a member with that name itself.
     */
    public hasMemberNamed(member: string): boolean {
        return this.membersNamed(member).length > 0;
    }
}
