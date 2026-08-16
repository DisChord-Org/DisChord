import { ChordError, ErrorLevel } from "../../errors/ChordError";
import { DisChordNode, DisChordNodeType } from "../../dischord/types";
import { CompilationContext } from "../../cli/commands/CompileCommand";
import { ASTNode, BaseNode } from "../types";
import { GeneratorContext } from "./GeneratorContext";
import { SubGeneratorClass } from "./SubGenerator";

import { ConditionVisitor } from "./visitors/clis/ConditionVisitor";
import { ExitVisitor } from "./visitors/clis/ExitVisitor";
import { LoopVisitor } from "./visitors/clis/LoopVisitor";
import { PassVisitor } from "./visitors/clis/PassVisitor";
import { ReturnVisitor } from "./visitors/clis/ReturnVisitor";

import { JSVisitor } from "./visitors/core/JSVisitor";
import { NewVisitor } from "./visitors/core/NewVisitor";

import { BDOVisitor } from "./visitors/expressions/BDOVisitor";
import { BinaryExpressionVisitor } from "./visitors/expressions/BinaryExpressionVisitor";
import { ExpressionVisitor } from "./visitors/expressions/ExpressionVisitor";
import { ListVisitor } from "./visitors/expressions/ListVisitor";
import { LiteralVisitor } from "./visitors/expressions/LiteralVisitor";
import { NoUnaryVisitor } from "./visitors/expressions/NoUnary";
import { UnaryVisitor } from "./visitors/expressions/UnaryVisitor";

import { ExportVisitor } from "./visitors/modularity/ExportVisitor";
import { FunctionVisitor } from "./visitors/modularity/FunctionVisitor";
import { ImportVisitor } from "./visitors/modularity/ImportVisitor";

import { ClassVisitor } from "./visitors/oop/ClassVisitor";
import { PropertyVisitor } from "./visitors/oop/PropertyVisitor";
import { SuperVisitor } from "./visitors/oop/SuperVisitor";
import { ThisVisitor } from "./visitors/oop/ThisVisitor";

import { AccessVisitor } from "./visitors/variables/AccessVisitor";
import { CallVisitor } from "./visitors/variables/CallVisitor";
import { IdentificatorVisitor } from "./visitors/variables/IdentificatorVisitor";
import { IndexAccessVisitor } from "./visitors/variables/IndexAccessVisitor";
import { VariableVisitor } from "./visitors/variables/VariableVisitor";
import { AssignmentVisitor } from "./visitors/variables/AssignmentVisitor";

/**
 * Main Orchestrator for the Code Generation phase in Chord.
 * Traverses the AST and delegates the translation of individual nodes 
 * to registered SubGenerators.
 */
export class Generator<T extends string, N extends BaseNode<T>> extends GeneratorContext<T, N> {
    /**
     * @param context - The active compilation context (symbol table, project paths, etc.).
     * @param nodes - The current file's complete top-level AST, captured once here (mirroring how
     * a TS `TransformationContext` closes over its `SourceFile` at transform setup) instead of
     * being set later as a side effect of calling `generate()`. Exposed as `this.nodes` so a
     * visitor that needs to look at its *siblings* — not just its own node — can do so (e.g.
     * `ClientInitVisitor`, writing its own separate output file, which still needs to know what
     * the file imports).
     */
    constructor(
        public readonly context: CompilationContext<T>,
        public readonly nodes: ASTNode<T, N>[]
    ) {
        super();

        this.setOwner(this);
        this.registerVisitors();
    }

    /**
     * Registry of all native Chord sub-generators.
     * Maps the AST node type string to its corresponding class constructor.
     */
    private static readonly SubGenerators: SubGeneratorClass<DisChordNodeType, DisChordNode>[] = [
        ConditionVisitor, ExitVisitor, LoopVisitor, PassVisitor, ReturnVisitor,
        JSVisitor, NewVisitor, BDOVisitor, BinaryExpressionVisitor, ExpressionVisitor,
        ListVisitor, LiteralVisitor, NoUnaryVisitor, UnaryVisitor,
        ExportVisitor, FunctionVisitor, ImportVisitor, ClassVisitor, PropertyVisitor,
        SuperVisitor, ThisVisitor, AccessVisitor, AssignmentVisitor, CallVisitor,
        IdentificatorVisitor, IndexAccessVisitor, VariableVisitor
    ];

    /**
     * Populates the local IoC context with the native sub-generators mapping.
     * @protected
     */
    protected registerVisitors (): void {
        Generator.SubGenerators.forEach(instance => {
            this.register(instance as unknown as SubGeneratorClass<T, N>);
        })
    }

    /**
     * Compiles `this.nodes` — the full top-level AST passed in at construction — into a runnable
     * JavaScript string.
     */
    public generate(): string {
        const body = this.nodes.map(node => {
            const code = this.visit(node);
            return code;
        }).join('\n');

        return `\n${body}\n`;
    }

    /**
     * Processes an individual AST Node by routing it to its matching SubGenerator.
     * @param node - The target node to be generated.
     */
    public visit(node: ASTNode<T, N>): string {
        const VisitorClass = Generator.SubGenerators.find(cls => cls.triggerToken === node.type);

        if (!VisitorClass) throw new ChordError({
            phase: ErrorLevel.Compiler,
            message: `Generador: Error al procesar el tipo de nodo '${node.type}'. Asegúrate de que su visitor esté correctamente registrado.`,
            location: node.location
        }).format();

        return this.get(VisitorClass as unknown as SubGeneratorClass<T, N>).visit(node);
    }

    /**
     * Secure utility method to evaluate optional or nullable structural properties.
     * @param node - Optional AST child target.
     */
    public visitIfExists(node: ASTNode<T, N> | undefined): string | undefined {
        return node ? this.visit(node) : undefined;
    }
}