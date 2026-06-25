import { corelib } from "../core.lib";
import { AccessNode, CallNode } from "../../chord/types";
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
        CollectorVisitor, MessageVisitor
    ];

    /**
     * Constructor for the DisChordGenerator class.
     * @param symbols A map of symbols used for code generation, typically containing variable and function definitions.
     * @param projectRoot The root directory of the project, used for resolving imports and file paths during code generation.
     */
    constructor(context: CompilationContext<DisChordNodeType>) {
        super(context);
    }

    /**
     * Populates the local IoC context with the native sub-generators mapping.
     * @protected
     */
    protected registerVisitors (): void {
        DisChordGenerator.DisChordSubGenerators.forEach(instance => {
            this.register(instance as SubGeneratorClass<DisChordNodeType, DisChordNode>);
        })
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

    /**
     * Overrides the generateAccess method to provide custom code generation for property access based on the core library mappings.
     * @override
     * @param node The AccessNode representing a property access in the AST, containing the object and property being accessed.
     * @returns The generated code for the property access, which may be translated based on the core library mappings or fall back to the default generation if no mapping is found.
     */
    override generateAccess(node: AccessNode<DisChordNodeType, DisChordNode>): string {
        const objName = node.object.type === 'Identificador' ? node.object.value : null;
        const propName = node.property;

        if (objName && corelib[objName]) {
            const mapping = corelib[objName];
            
            if (typeof mapping === 'object' && mapping[propName]) {
                const translation = mapping[propName];
                
                if (translation.startsWith(objName + '.')) {
                    return translation;
                }
                return `${objName}.${translation}`;
            }
        }

        return super.generateAccess(node as AccessNode<DisChordNodeType>);
    }

    /**
     * Overrides the generateCall method to provide custom code generation for function calls based on the core library mappings.
     * @override
     * @param node The CallNode representing a function call in the AST, containing the function being called and its parameters.
     * @returns The generated code for the function call, which may be translated based on the core library mappings or fall back to the default generation if no mapping is found.
     */
    override generateCall(node: CallNode<DisChordNodeType, DisChordNode>): string {
        if (node.object.type === 'Identificador') {
            const name = node.object.value;
            
            if (typeof corelib[name] === 'string') {
                const translation = corelib[name] as string;
                const args = node.params.map((arg: DisChordASTNode) => this.visit(arg)).join(', ');
                return `${translation}(${args})`;
            }
        }

        return super.generateCall(node as CallNode<DisChordNode>);
    }
}