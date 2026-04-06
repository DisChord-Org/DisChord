import { corelib } from "./../core.lib";
import { AccessNode, ASTNode, CallNode } from "../../chord/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType, ODBNode } from "./../types";

import { Generator } from "../../chord/generator";
import { SubGeneratorClass } from "./subgenerator";

import ClietInitGenerator from "./Client/ClientInitGenerator";
import EventGenerator from "./Events/EventGenerator";
import CommandGenerator from "./Commands/CommandGenerator";
import MessageGenerator from "./Messages/MessageGenerator";
import CollectorGenerator from "./CollectorGenerator";

/**
 * Main generator class for DisChord.
 * It extends the base Generator class and overrides the visit method to handle DisChord-specific AST nodes.
 */
export class DisChordGenerator extends Generator<DisChordNodeType, DisChordNode> {
    // Root directory of the project, used for resolving imports and file paths.
    public projectRoot: string = '';

    // Context variable to track the current interaction state, used for generating appropriate code in message interactions and collectors.
    public currentInteraction: string | null = null; // context

    /**
     * The inventory of specialists.
     * Adding a class here will register it into the all system.
     */
        private static readonly SubGenerators: SubGeneratorClass[] = [
            ClietInitGenerator,
            EventGenerator,
            CommandGenerator,
            MessageGenerator,
            CollectorGenerator
        ];

    /**
     * Constructor for the DisChordGenerator class.
     * @param symbols A map of symbols used for code generation, typically containing variable and function definitions.
     * @param projectRoot The root directory of the project, used for resolving imports and file paths during code generation.
     */
    constructor(symbols: Map<string, any>, projectRoot: string) {
        super(symbols);
        this.projectRoot = projectRoot;
    }

    /**
     * Overrides the visit method to handle DisChord-specific AST nodes.
     * It checks the type of the node and delegates code generation to the appropriate generator class based on the node type.
     * @override
     * @param node The AST node to visit, which can be of various types defined in the DisChordNodeType enum.
     * @returns The generated code for the given node.
     */
    override visit(node: DisChordASTNode): string {
        const GeneratorClass = DisChordGenerator.SubGenerators.find(SubGenerator =>
            SubGenerator.triggerToken === node.type
        );

        if (GeneratorClass) return new GeneratorClass(this).generate(node);

        return super.visit(node as ASTNode<DisChordNodeType>);
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

    /**
     * Retrieves a specific property node from an ODB.
     * This utility allows sub-generators to extract configuration values 
     * or nested blocks defined within a BDO structure.
     * * @param node The ODBNode containing the property blocks.
     * @param property The key name of the property to retrieve.
     * @returns The corresponding DisChordASTNode if the property exists, otherwise undefined.
     */
    public getODBProperty(node: ODBNode, property: string): DisChordASTNode | undefined {
        return node.blocks[property];
    }
}