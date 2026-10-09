import { Test } from "../../../Test";
import { corelib } from "../../../../src/dischord/corelib/corelib.data";
import { runtimeHelperNames } from "../../../../src/chord/corelib/runtimeHelpers";

/**
 * @class CoreLibHelpersConsistencyTest
 * @description Validates that every instance property, and every instance method name the core library maps to different JavaScript members in different classes has a runtime helper (`chord<Name>`) to pick between them when the receiver's class isn't known. Without it the call would silently go to the first class by name.
 */
export class CoreLibHelpersConsistencyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Core Lib Helpers Consistency - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to have a runtime helper for every instance method name that means different members in different classes";

    /**
     * Not a compilation: it checks the core library table against the runtime helpers.
     * @override
     */
    protected override async run (): Promise<void> {
        const transpilesByName = new Map<string, Set<string>>();

        Object.values(corelib.classes).forEach(entry => {
            Object.entries(entry.methods).forEach(([ name, member ]) => {
                if (member.static || member.runtime) return;

                const transpiles = transpilesByName.get(name) ?? new Set<string>();
                transpiles.add(member.transpile);
                transpilesByName.set(name, transpiles);
            });
        });

        const missing = [ ...transpilesByName ]
            .filter(([ , transpiles ]) => transpiles.size > 1)
            .map(([ name ]) => `${name} -> chord${name.charAt(0).toUpperCase()}${name.slice(1)}`)
            .filter(entry => !runtimeHelperNames.has(entry.split(' -> ')[1]));

        const missingProperties = Object.values(corelib.classes)
            .flatMap(entry => Object.entries(entry.properties ?? {}).filter(([ , member ]) => !member.static && !member.runtime).map(([ name ]) => name))
            .map(name => `chord${name.charAt(0).toUpperCase()}${name.slice(1)}`)
            .filter(helper => !runtimeHelperNames.has(helper));

        if (missingProperties.length > 0) {
            throw new Error(`Instance properties need a runtime helper in runtimeHelperNames, to read them on a receiver of unknown type: ${missingProperties.join(', ')}`);
        }

        if (missing.length > 0) {
            throw new Error(`Instance methods with different members across classes need a runtime helper in runtimeHelperNames: ${missing.join(', ')}`);
        }
    }
}
