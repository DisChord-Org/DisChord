import { CompilationContext } from "../../init/Init";
import { ASTNode, BaseNode } from "../types";
import { GeneratorContext } from "./GeneratorContext";
import { SubGeneratorClass } from "./SubGenerator";

/**
 * Main Orchestrator for the Code Generation phase in Chord.
 * Traverses the AST and delegates the translation of individual nodes 
 * to registered SubGenerators.
 */
export class Generator<T extends string = string, N extends BaseNode<T> = BaseNode<T>> extends GeneratorContext<T, N> {
    
    /**
     * Statement node types that handle their own block structure 
     * and do not require a forced trailing semicolon.
     */
    private readonly noSemicolonNodes: string[] = [ 'Condicion', 'Bucle', 'Clase', 'Funcion' ];

    constructor(
        public readonly context: CompilationContext
    ) {
        super();
        
        this.setOwner(this);
        this.registerVisitors();
    }

    /**
     * Registry of all native Chord sub-generators.
     * Maps the AST node type string to its corresponding class constructor.
     */
    private static readonly SubGeneratorsMap: SubGeneratorClass<T, N>[] = [];

    /**
     * Populates the local IoC context with the native sub-generators mapping.
     * @override
     * @protected
     */
    protected override registerVisitors (): void {
        Object.entries(Generator.SubGeneratorsMap).forEach(([nodeType, VisitorClass]) => {
            this.register(nodeType, VisitorClass as unknown as SubGeneratorClass<T, N, ASTNode<T, N>>);
        });
    }

    /**
     * Entry-point that takes a full chunk of top-level AST nodes 
     * and compiles them into a runnable JavaScript string.
     * @param nodes - Array of abstract syntax tree nodes.
     */
    public generate(nodes: ASTNode<T, N>[]): string {
        const body = nodes.map(node => {
            const code = this.visit(node);
            return this.noSemicolonNodes.includes(node.type) ? code : `${code};`;
        }).join('\n');

        return `
            ${runtimeInjections}
            ${body}
        `;
    }

    /**
     * Processes an individual AST Node by routing it to its matching SubGenerator.
     * @param node - The target node to be generated.
     */
    public visit(node: ASTNode<T, N>): string {
        try {
            return this.get(node.type).visit(node);
        } catch (error) {
            throw new ChordError({
                phase: ErrorLevel.Compiler,
                message: `Generador: Error al procesar el tipo de nodo '${node.type}'. Asegúrate de que su visitor esté correctamente registrado.`,
                location: node.location
            }).format();
        }
    }

    /**
     * Secure utility method to evaluate optional or nullable structural properties.
     * @param node - Optional AST child target.
     */
    public visitIfExists(node: ASTNode<T, N> | undefined): string | undefined {
        return node ? this.visit(node) : undefined;
    }
}