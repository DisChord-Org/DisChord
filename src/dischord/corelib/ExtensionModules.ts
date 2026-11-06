import { SharedModule } from "../../chord/model/SharedModule";
import { corelib, DisChordClassesEnum } from "./corelib.data";

/** How a shared extensions module patches one Seyfert class: the class and the expression its getter hands to the accessor. */
export interface ExtensionTarget {
    /** A class imported from `seyfert`, whose `prototype` gets the getters. */
    readonly className: string;
    /** What the getter passes to the accessor: `this`, or `this.user` for a member that wraps a user. */
    readonly receiver: string;
}

/** Everything that differs between the shared modules that patch Seyfert's classes with Spanish getters. */
export interface ExtensionModuleSpec {
    /** Path of the module, relative to the project's `dist` directory. */
    readonly path: string;
    /** The classes patched; all of them are imported from `seyfert`. */
    readonly targets: readonly ExtensionTarget[];
    /** The name of the `Map` of accessors the module builds. */
    readonly mapName: string;
    /** The parameter of each accessor. */
    readonly receiver: string;
    /** Spanish property name -> the member it reads. */
    readonly names: Readonly<Record<string, string>>;
    /** Statements placed before the map of accessors, already indented. */
    readonly before?: string;
    /** Statements placed after the map of accessors, already indented. */
    readonly after?: string;
}

/**
 * Builds the shared modules that patch the prototypes of Seyfert's classes with Spanish getters, and
 * the tables of property names they are built from.
 */
export class ExtensionModules {
    /**
     * The Spanish properties of a core library class and the real Seyfert member each one reads.
     * @param {DisChordClassesEnum} className - A class of the core library.
     * @returns {Readonly<Record<string, string>>} Spanish property name -> what it transpiles to.
     */
    public static propertyNamesOf (className: DisChordClassesEnum): Readonly<Record<string, string>> {
        return Object.fromEntries(
            Object.entries(corelib.classes[className].properties ?? {}).map(([spanish, member]) => [spanish, member.transpile])
        );
    }

    /**
     * The entries of the `Map` of accessors a shared extensions module builds.
     * @param {Readonly<Record<string, string>>} names - Spanish property name -> the member it reads.
     * @param {string} receiver - The parameter of each accessor.
     * @returns {string} One `['spanish', (receiver) => receiver.member]` line per name, joined with commas.
     */
    public static accessorEntries (names: Readonly<Record<string, string>>, receiver: string): string {
        return Object.entries(names).map(([spanish, real]) => `        ['${spanish}', (${receiver}) => ${receiver}.${real}]`).join(',\n');
    }

    /**
     * Builds a shared module that patches the prototypes of Seyfert's classes with one getter per Spanish
     * property: the accessors are written once, as a `Map`, and installed on every target.
     * @param {ExtensionModuleSpec} spec - What makes this module different from the others.
     * @returns {SharedModule} The module, its source being plain JavaScript.
     */
    public static create (spec: ExtensionModuleSpec): SharedModule {
        const imports = spec.targets.map(target => target.className).join(', ');
        const before = spec.before ? `${spec.before}\n\n` : '';
        const after = spec.after ? `\n\n${spec.after}` : '';
        const definitions = spec.targets
            .map(target => `        Object.defineProperty(${target.className}.prototype, name, { get() { return resolve(${target.receiver}); }, configurable: true });`)
            .join('\n');

        return {
            path: spec.path,
            content: `
    import { ${imports} } from 'seyfert';

${before}    const ${spec.mapName} = new Map([
${ExtensionModules.accessorEntries(spec.names, spec.receiver)}
    ]);${after}

    for (const [name, resolve] of ${spec.mapName}) {
${definitions}
    }
`
        };
    }
}
