import { Symbol } from "../types";

/**
 * The classes declared in the file, by name: each one's parent class and the members it declares
 * itself, so a member can be found from a class name and through inheritance.
 */
export class ClassRegistry {
    private readonly classes: Map<string, { superClass?: string; members: ReadonlyMap<string, Symbol> }> = new Map();

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
        const seen = new Set<string>();
        let current: string | undefined = className;

        while (current !== undefined && !seen.has(current)) {
            seen.add(current);
            const entry = this.classes.get(current);
            if (!entry) return undefined;

            const symbol = entry.members.get(member);
            if (symbol) return symbol;

            current = entry.superClass;
        }

        return undefined;
    }

    /**
     * @param {string} sub - A class name.
     * @param {string} base - A class name.
     * @returns {boolean} Whether `sub` is `base` or extends it, directly or through other classes. A cycle in the chain is cut.
     */
    public isSubclassOf(sub: string, base: string): boolean {
        const seen = new Set<string>();
        let current: string | undefined = sub;

        while (current !== undefined && !seen.has(current)) {
            if (current === base) return true;

            seen.add(current);
            current = this.classes.get(current)?.superClass;
        }

        return false;
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
