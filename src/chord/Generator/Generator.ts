import { ChordError, ErrorLevel } from "../../ChordError";
import { DisChordNode, DisChordNodeType } from "../../dischord/types";
import { CompilationContext } from "../../init/Init";
import { runtimeInjections } from "./core.lib";
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
    constructor(
        public readonly context: CompilationContext<T>
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
     * Entry-point that takes a full chunk of top-level AST nodes 
     * and compiles them into a runnable JavaScript string.
     * @param nodes - Array of abstract syntax tree nodes.
     */
    public generate(nodes: ASTNode<T, N>[]): string {
        const body = nodes.map(node => {
            const code = this.visit(node);
            return code;
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