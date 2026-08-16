import { DisChordASTNode, DisChordNode, DisChordNodeType } from "../types";

import { Generator } from "../../chord/Generator/Generator";
import { SubGeneratorClass } from "../../chord/Generator/SubGenerator";

import ClientInitVisitor from '../Generator/visitors/architectural/ClientInitVisitor';
import CommandVisitor from '../Generator/visitors/architectural/CommandVisitor';
import EventVisitor from '../Generator/visitors/architectural/EventVisitor';
import { CompilationContext } from "../../cli/commands/CompileCommand";
import ButtonVisitor from "./visitors/components/ButtonVisitor";
import ButtonDeclarationVisitor from "./visitors/components/ButtonDeclarationVisitor";
import ActionRowVisitor from "./visitors/components/ActionRowVisitor";
import CommandOptionVisitor from "./visitors/components/CommandOptionVisitor";
import EmbedVisitor from "./visitors/components/EmbedVisitor";
import EmbedDeclarationVisitor from "./visitors/components/EmbedDeclarationVisitor";
import CollectorVisitor from "./visitors/features/CollectorVisitor";
import MessageVisitor from "./visitors/features/MessageVisitor";
import { DisChordAccessVisitor } from "./visitors/variables/DisChordAccessVisitor";
import { DisChordCallVisitor } from "./visitors/variables/DisChordCallVisitor";

/**
 * Main generator class for DisChord.
 * It extends the base Generator class and overrides the visit method to handle DisChord-specific AST nodes.
 */
export class DisChordGenerator extends Generator<DisChordNodeType, DisChordNode> {
    /**
     * The inventory of specialists.
     * Adding a class here will register it into the all system.
     */
    private static readonly DisChordSubGenerators: SubGeneratorClass<DisChordNodeType, DisChordNode>[] = [
        ClientInitVisitor, CommandVisitor, EventVisitor,
        ButtonVisitor, ButtonDeclarationVisitor, ActionRowVisitor, CommandOptionVisitor, EmbedVisitor, EmbedDeclarationVisitor,
        CollectorVisitor, MessageVisitor,
        DisChordAccessVisitor, DisChordCallVisitor
    ];

    /**
     * Constructor for the DisChordGenerator class.
     * @param context The active compilation context (symbol table, project paths, etc.).
     * @param nodes The current file's complete top-level AST.
     */
    constructor(context: CompilationContext<DisChordNodeType>, nodes: DisChordASTNode[]) {
        super(context, nodes);

        this.registerVisitors();
    }

    /**
     * Populates the local IoC context with the native sub-generators mapping.
     * @protected
     */
    protected registerVisitors (): void {
        DisChordGenerator.DisChordSubGenerators.forEach(instance => {
            this.register(instance as SubGeneratorClass<DisChordNodeType, DisChordNode>);
        })

        super.registerVisitors();
    }

    /**
     * Overrides the visit method to handle DisChord-specific AST nodes.
     * It checks the type of the node and delegates code generation to the appropriate generator class based on the node type.
     * @override
     * @param node The AST node to visit, which can be of various types defined in the DisChordNodeType enum.
     * @returns The generated code for the given node.
     */
    override visit(node: DisChordASTNode): string {
        const GeneratorClass = DisChordGenerator.DisChordSubGenerators.find(SubGenerator =>
            SubGenerator.triggerToken === node.type
        );

        if (GeneratorClass) {
            const instance = new GeneratorClass(this);

            return instance.visit(node);
        }

        return super.visit(node);
    }
}