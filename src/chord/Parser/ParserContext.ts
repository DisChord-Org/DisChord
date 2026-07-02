import { BaseNode } from "../types";
import { Parser } from "./Parser";
import { SubParser } from "./SubParser";

/**
 * Represents the constructor signature of any SubParser subclass.
 * * @template {string} T - The custom token classification vector.
 * * @template {BaseNode<T>} N - The custom node definition structural framework.
 * * @template {SubParser<T, N>} S - The specific SubParser type being instantiated.
 * * @template {Parser<T, N>} TP - The precise implementation type of the parent Parser.
 */
export type SubParserClass<
    T extends string,
    N extends BaseNode<T>,
    S extends SubParser<T, N> = SubParser<T, N>,
    TP extends Parser<T, N> = Parser<T, N>
> = new (parent: TP) => S;

/**
 * @class ParserContext
 * @description Dependency injection container and registry for SubParsers.
 * When extended by a Parser, it manages grammar rule lifecycles and 
 * automatically injects the parent parser reference into new instances.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class ParserContext<T extends string, N extends BaseNode<T>> {
    /**
     * Set of authorized SubParser constructor references.
     * @private
     */
    private registry: Set<SubParserClass<T, N, SubParser<T, N>, Parser<T, N>>> = new Set();

    /**
     * Cache map storing already instantiated SubParsers.
     * @private
     */
    private instances: Map<SubParserClass<T, N, SubParser<T, N>, Parser<T, N>>, SubParser<T, N>> = new Map();

    /**
     * Reference to the parser that owns this context.
     * @private
     */
    private owner!: Parser<T, N>;

    constructor() {}

    /**
     * Injects the execution instance context into the local lifecycle state.
     * @param owner - The runtime Parser instance.
     */
    protected setOwner (owner: Parser<T, N>): this {
        this.owner = owner;
        return this;
    }

    /**
     * Registers a SubParser class definition.
     * @template {SubParser<T, N>} S - Extensible target SubParser structure.
     * @param {SubParserClass<T, N, S, Parser<T, N>>} cls - The constructor class reference blueprint.
     * @returns {void}
     */
    public register<S extends SubParser<T, N>>(cls: SubParserClass<T, N, S, Parser<T, N>>): void {
        if (!this.registry.has(cls)) {
            this.registry.add(cls);
        }
    }

    /**
     * Resolves and retrieves the singleton instance of the requested SubParser.
     * @template {SubParser<T, N>} S - The expected exact subclass variant layout to return.
     * @param {SubParserClass<T, N, S, Parser<T, N>>} cls - The targeted constructor class lookup definition reference.
     * @param {Parser<T, N>} [parent] - Optional explicit parent override context reference. Defaults to the context owner.
     * @returns {S} The fully resolved and ready operational subclass framework instance.
     * @throws {Error} Security error tracking if the requested constructor blueprint has not been registered prior.
     * @throws {Error} Context lifecycle instantiation error tracking if no parent or owner is found.
     */
    public get<S extends SubParser<T, N>>(cls: SubParserClass<T, N, S, Parser<T, N>>, parent?: Parser<T, N>): S {
        if (!this.registry.has(cls)) throw new Error(`[ParserContext] Error de seguridad: La clase ${cls.name} aún no se ha registrado.`);

        let instance = this.instances.get(cls);

        if (!instance) {
            const targetParent = parent ?? this.owner;
            if (!targetParent) throw new Error("[ParserContext] Intento de instanciación sin Parent.");

            instance = new cls(targetParent);
            this.instances.set(cls, instance);
        }

        return instance as S;
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