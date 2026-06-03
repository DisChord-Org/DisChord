import { Generator } from "../generator";
import { BaseNode } from "../types";
import { SubGenerator } from "./SubGenerator";

/**
 * Represents the constructor signature of any SubGenerator subclass.
 * @template {string} T - The custom token classification vector.
 * @template {BaseNode<T>} N - The custom node definition structural framework.
 * @template {SubGenerator<T, N>} S - The specific SubGenerator type being instantiated.
 * @template {Generator<T, N>} TG - The precise implementation type of the parent Generator.
 */
export type SubGeneratorClass<
    T extends string,
    N extends BaseNode<T>,
    S extends SubGenerator<T, N> = SubGenerator<T, N>,
    TG extends Generator<T, N> = Generator<T, N>
> = new (parent: TG) => S;

/**
 * Isolated Context Lifecycle Manager for the Code Generation Phase.
 * Acts as an internal IoC container for structural AST node processors.
 */
export class GeneratorContext<T extends string, N extends BaseNode<T>> {
    /**
     * Internal registry pairing strict AST node types with their atomic visitors.
     * @private
     */
    private registry: Set<SubGeneratorClass<T, N, SubGenerator<T, N>, Generator<T, N>>> = new Set();

    /**
     * Cache map storing already instantiated SubGenerators.
     * @private
     */
    private instances: Map<SubGeneratorClass<T, N, SubGenerator<T, N>, Generator<T, N>>, SubGenerator<T, N>> = new Map();

    /**
     * Active runtime reference to the main concrete Generator orchestrator.
     * @protected
     */
    protected owner!: Generator<T, N>;

    constructor () {}

    /**
     * Injects the execution instance context into the local lifecycle state.
     * @param owner - The runtime Generator instance.
     */
    public setOwner (owner: Generator<T, N>): this {
        this.owner = owner;
        return this;
    }

    /**
     * Registers a SubGenerator class definition.
     * @template {SubGenerator<T, N>} S - Extensible target SubGenerator structure.
     * @param {SubGeneratorClass<T, N, S, Generator<T, N>>} cls - The constructor class reference blueprint.
     * @returns {void}
     */
    public register<S extends SubGenerator<T, N>>(cls: SubGeneratorClass<T, N, S, Generator<T, N>>): void {
        if (!this.registry.has(cls)) {
            this.registry.add(cls);
        }
    }

    /**
     * Resolves and retrieves the singleton instance of the requested SubGenerator.
     * @template {SubGenerator<T, N>} S - The expected exact subclass variant layout to return.
     * @param {SubGeneratorClass<T, N, S, Generator<T, N>>} cls - The targeted constructor class lookup definition reference.
     * @param {Generator<T, N>} [parent] - Optional explicit parent override context reference. Defaults to the context owner.
     * @returns {S} The fully resolved and ready operational subclass framework instance.
     * @throws {Error} Security error tracking if the requested constructor blueprint has not been registered prior.
     * @throws {Error} Context lifecycle instantiation error tracking if no parent or owner is found.
     */
    public get<S extends SubGenerator<T, N>>(cls: SubGeneratorClass<T, N, S, Generator<T, N>>, parent?: Generator<T, N>): S {
        if (!this.registry.has(cls)) throw new Error(`[GeneratorContext] Error de seguridad: La clase ${cls.name} aún no se ha registrado.`);

        let instance = this.instances.get(cls);

        if (!instance) {
            const targetParent = parent ?? this.owner;
            if (!targetParent) throw new Error("[GeneratorContext] Intento de instanciación sin Parent.");

            instance = new cls(targetParent);
            this.instances.set(cls, instance);
        }

        return instance as S;
    }

    /**
     * Clears all cached SubGenerator instances to free memory.
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