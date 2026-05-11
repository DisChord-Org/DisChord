import { Parser } from "./parser";
import { SubParser } from "./subparser";

/**
 * Represents the constructor signature of any SubParser subclass.
 * * @template T - The specific SubParser type being instantiated.
 * * @template TP  The type of Parser.
 */
export type SubParserClass<S extends SubParser<any, any>, TP extends Parser<any, any> = Parser<any, any>> = new (parent: TP) => S;

/**
 * @class ParserContext
 * @description Dependency injection container and registry for SubParsers.
 * When extended by a Parser, it manages grammar rule lifecycles and 
 * automatically injects the parent parser reference into new instances.
 */
export class ParserContext<T = any, N = any> {
    /**
     * Set of authorized SubParser constructor references.
     * @private
     */
    private registry: Set<SubParserClass<SubParser<T, N>, any>> = new Set();

    /**
     * Cache map storing already instantiated SubParsers.
     * @private
     */
    private instances: Map<SubParserClass<SubParser<T, N>, any>, SubParser<T, N>> = new Map();

    /**
     * Reference to the parser that owns this context.
     * @private
     */
    private owner!: Parser<T, N>;

    constructor() {}

    protected setOwner (owner: Parser<T, N>): this {
        this.owner = owner;
        return this;
    }

    /**
     * Registers a SubParser class definition.
     * @param cls - The constructor reference.
     */
    public register<S extends SubParser<T, N>>(cls: SubParserClass<S, any>): void {
        if (!this.registry.has(cls)) {
            this.registry.add(cls);
        }
    }

    /**
     * Resolves and retrieves the singleton instance of the requested SubParser.
     * @template T - The type of SubParser expected.
     * @param cls - The constructor reference.
     * @param [parent] - Optional explicit parent override. Defaults to context owner.
     * @returns {T} The resolved instance.
     * @throws {Error} If the requested class has not been registered.
     */
    public get<S extends SubParser<T, N>>(cls: SubParserClass<S, any>, parent?: Parser<T, N>): S {
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