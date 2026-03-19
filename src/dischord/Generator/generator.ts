import { Generator } from "../../chord/generator";
import { AccessNode, ASTNode, CallNode } from "../../chord/types";
import { corelib } from "./../core.lib";
import { CollectorNode, CommandNode, DisChordNodeType, EventNode, MessageNode, StartBotNode } from "./../types";
import ClietInitGenerator from "./Client/ClientInitGenerator";
import EventGenerator from "./Events/EventGenerator";
import CommandGenerator from "./Commands/CommandGenerator";
import MessageGenerator from "./Messages/MessageGenerator";
import CollectorGenerator from "./CollectorGenerator";

/**
 * Main generator class for DisChord.
 * It extends the base Generator class and overrides the visit method to handle DisChord-specific AST nodes.

 */
export class DisChordGenerator extends Generator {
    // Root directory of the project, used for resolving imports and file paths.
    projectRooth: string = '';

    // Context variable to track the current interaction state, used for generating appropriate code in message interactions and collectors.
    public currentInteraction: string | null = null; // context

    // Client initialization generator, responsible for generating code related to starting the bot and setting up the client.
    private ClientInitGenerator = new ClietInitGenerator(this);
    // Event generator, responsible for generating code related to listeners.
    private EventGenerator = new EventGenerator(this);
    // Command generator, responsible for generating code related to command definitions.
    private CommandGenerator = new CommandGenerator(this);
    // Message generator, responsible for generating code related to message creation and interactions.
    private MessageGenerator = new MessageGenerator(this);
    // Collector generator, responsible for generating code related to component collectors and their event handling.
    private CollectorGenerator = new CollectorGenerator(this);

    /**
     * Constructor for the DisChordGenerator class.
     * @param symbols A map of symbols used for code generation, typically containing variable and function definitions.
     * @param projectRoot The root directory of the project, used for resolving imports and file paths during code generation.
     */
    constructor(symbols: Map<string, any>, projectRoot: string) {
        super(symbols);
        this.projectRooth = projectRoot;
    }

    /**
     * Overrides the visit method to handle DisChord-specific AST nodes.
     * It checks the type of the node and delegates code generation to the appropriate generator class based on the node type.
     * @override
     * @param node The AST node to visit, which can be of various types defined in the DisChordNodeType enum.
     * @returns The generated code for the given node.
     */
    override visit(node: ASTNode): string {
        switch (node.type as DisChordNodeType) {
            case 'EncenderBot':
                return this.ClientInitGenerator.generate(node as unknown as StartBotNode);
            case 'Evento':
                return this.EventGenerator.generate(node as unknown as EventNode);
            case 'CrearMensaje':
                return this.MessageGenerator.generate(node as unknown as MessageNode);
            case 'CrearComando':
                return this.CommandGenerator.generate(node as unknown as CommandNode);
            case 'CrearRecolector':
                return this.CollectorGenerator.generate(node as unknown as CollectorNode);
            default:
                return super.visit(node);
        }
    }

    /**
     * Overrides the generateAccess method to provide custom code generation for property access based on the core library mappings.
     * @override
     * @param node The AccessNode representing a property access in the AST, containing the object and property being accessed.
     * @returns The generated code for the property access, which may be translated based on the core library mappings or fall back to the default generation if no mapping is found.
     */
    override generateAccess(node: AccessNode): string {
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

        return super.generateAccess(node);
    }

    /**
     * Overrides the generateCall method to provide custom code generation for function calls based on the core library mappings.
     * @override
     * @param node The CallNode representing a function call in the AST, containing the function being called and its parameters.
     * @returns The generated code for the function call, which may be translated based on the core library mappings or fall back to the default generation if no mapping is found.
     */
    override generateCall(node: CallNode): string {
        if (node.object.type === 'Identificador') {
            const name = node.object.value;
            
            if (typeof corelib[name] === 'string') {
                const translation = corelib[name] as string;
                const args = node.params.map((arg: ASTNode) => this.visit(arg)).join(', ');
                return `${translation}(${args})`;
            }
        }

        return super.generateCall(node);
    }
}