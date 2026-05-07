import { Parser } from "../parser";
import { SubParser } from "./subparser";

/**
 * Represents the constructor signature of any SubParser subclass.
 * * @template T - The specific SubParser type being instantiated.
 */
export type SubParserClass<T extends SubParser<any, any>> = new (parent: Parser<any, any>) => T;

/**
 * @class ParserContext
 * @description Static registry and dependency injection container for SubParsers.
 * It manages the lifecycle of grammar rules (SubParsers) through a lazy-loading mechanism.
 * SubParsers must be registered before retrieval to prevent illegal state execution.
 */
export class ParserContext {
    /**
     * Set of authorized SubParser constructor references.
     * * @private
     * @static
     * @type {Set<SubParserClass<any>>}
     */
    private static registry: Set<SubParserClass<any>> = new Set();

    /**
     * Cache map storing already instantiated SubParsers to avoid redundant memory allocations.
     * * @private
     * @static
     * @type {Map<SubParserClass<any>, SubParser<any, any>>}
     */
    private static instances: Map<SubParserClass<any>, SubParser<any, any>> = new Map();

    /**
     * Registers a SubParser class definition in the authorized registry.
     * This registers the blueprint without instantiating it.
     * * @static
     * @template T - The type of SubParser being registered.
     * @param {SubParserClass<T>} cls - The constructor reference of the SubParser subclass.
     * @returns {void}
     */
    public static register<T extends SubParser<any, any>>(cls: SubParserClass<T>): void {
        if (!this.registry.has(cls)) {
            this.registry.add(cls);
        }
    }

    /**
     * Resolves and retrieves the singleton instance of the requested SubParser class.
     * If the instance does not exist in cache but is registered, it lazily instantiates it.
     * * @static
     * @template T - The type of SubParser expected to be returned.
     * @param {SubParserClass<T>} cls - The constructor reference of the requested SubParser.
     * @param {Parser<any, any>} parent - The active Parser orchestrator acting as parent context.
     * @returns {T} The resolved, typed SubParser instance.
     * @throws {Error} If the requested class has not been previously registered.
     */
    public static get<T extends SubParser<any, any>>(cls: SubParserClass<T>, parent: Parser<any, any>): T {
        if (!this.registry.has(cls)) throw new Error(`[ParserContext] Error de seguridad: La clase ${cls.name} no ha sido registrada.`);

        let instance = this.instances.get(cls);

        if (!instance) {
            instance = new cls(parent);
            this.instances.set(cls, instance);
        }

        return instance as T;
    }

    /**
     * Clears all cached SubParser instances to free memory.
     * This keeps the static class registry intact.
     * * @static
     * @returns {void}
     */
    public static flush(): void {
        this.instances.clear();
    }
    
    /**
     * Fully resets the context, clearing both the instances cache and the class registry.
     * Useful for running clean compiler test suites.
     * * @static
     * @returns {void}
     */
    public static reset(): void {
        this.instances.clear();
        this.registry.clear();
    }
}