import { DisChordASTNode, DisChordNode, DisChordNodeType } from "../types";

import { Generator } from "../../chord/Generator/Generator";
import { SubGeneratorClass } from "../../chord/Generator/SubGenerator";

import ClientInitVisitor from '../Generator/visitors/architectural/ClientInitVisitor';
import CommandVisitor from '../Generator/visitors/architectural/CommandVisitor';
import EventVisitor from '../Generator/visitors/architectural/EventVisitor';
import { CompilationContext } from "../../init/Init";
import ButtonVisitor from "./visitors/components/ButtonVisitor";
import CommandOptionVisitor from "./visitors/components/CommandOptionVisitor";
import EmbedVisitor from "./visitors/components/EmbedVisitor";
import CollectorVisitor from "./visitors/features/CollectorVisitor";
import MessageVisitor from "./visitors/features/MessageVisitor";
import { DisChordContext } from "./types";
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
        ButtonVisitor, CommandOptionVisitor, EmbedVisitor,
        CollectorVisitor, MessageVisitor,
        DisChordAccessVisitor, DisChordCallVisitor
    ];

    /**
     * Constructor for the DisChordGenerator class.
     * @param symbols A map of symbols used for code generation, typically containing variable and function definitions.
     * @param projectRoot The root directory of the project, used for resolving imports and file paths during code generation.
     */
    constructor(context: CompilationContext<DisChordNodeType>) {
        super(context);
        
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
    override visit(node: DisChordASTNode, context?: DisChordContext): string {
        const GeneratorClass = DisChordGenerator.DisChordSubGenerators.find(SubGenerator =>
            SubGenerator.triggerToken === node.type
        );

        if (GeneratorClass) {
            const instance = new GeneratorClass(this);

            if (instance instanceof MessageVisitor) instance.setInteraction(!!context?.isInteraction);

            return instance.visit(node);
        }

        return super.visit(node);
    }
}