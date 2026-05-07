import { Parser } from "../parser";
import { SubParser } from "./subparser";

/**
 * Represents the constructor signature of any SubParser subclass.
 * * @template T - The specific SubParser type being instantiated.
 */
export type SubParserClass<T extends SubParser<any, any>> = new (parent: Parser<any, any>) => T;

/**
 * @class ParserContext
 * @description Dependency injection container and registry for SubParsers.
 * When extended by a Parser, it manages grammar rule lifecycles and 
 * automatically injects the parent parser reference into new instances.
 */
export class ParserContext {
    /**
     * Set of authorized SubParser constructor references.
     * @private
     * @type {Set<SubParserClass<any>>}
     */
    private registry: Set<SubParserClass<any>> = new Set();

    /**
     * Cache map storing already instantiated SubParsers.
     * @private
     * @type {Map<SubParserClass<any>, SubParser<any, any>>}
     */
    private instances: Map<SubParserClass<any>, SubParser<any, any>> = new Map();

    /**
     * Reference to the parser that owns this context.
     * @private
     * @type {Parser<any, any>}
     */
    private owner: Parser<any, any>;

    /**
     * @param {Parser<any, any>} owner - The Parser instance to be injected as parent.
     */
    constructor(owner: Parser<any, any>) {
        this.owner = owner;
    }

    /**
     * Registers a SubParser class definition.
     * @template T - The type of SubParser.
     * @param {SubParserClass<T>} cls - The constructor reference.
     */
    public register<T extends SubParser<any, any>>(cls: SubParserClass<T>): void {
        if (!this.registry.has(cls)) {
            this.registry.add(cls);
        }
    }

    /**
     * Resolves and retrieves the singleton instance of the requested SubParser.
     * @template T - The type of SubParser expected.
     * @param {SubParserClass<T>} cls - The constructor reference.
     * @param {Parser<any, any>} [parent] - Optional explicit parent override. Defaults to context owner.
     * @returns {T} The resolved instance.
     * @throws {Error} If the requested class has not been registered.
     */
    public get<T extends SubParser<any, any>>(cls: SubParserClass<T>, parent?: Parser<any, any>): T {
        if (!this.registry.has(cls)) {
            throw new Error(`[ParserContext] Security Error: The class ${cls.name} has not been registered.`);
        }

        let instance = this.instances.get(cls);

        if (!instance) {
            const targetParent = parent ?? this.owner;
            instance = new cls(targetParent);
            this.instances.set(cls, instance);
        }

        return instance as T;
    }

    /**
     * Clears all cached SubParser instances to free memory.
     * This keeps the static class registry intact.
     * @returns {void}
     */
    public flush(): void {
        this.instances.clear();
    }
    
    /**
     * Fully resets the context, clearing both the instances cache and the class registry.
     * Useful for running clean compiler test suites.
     * @returns {void}
     */
    public reset(): void {
        this.instances.clear();
        this.registry.clear();
    }
}