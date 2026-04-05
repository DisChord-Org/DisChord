import { DisChordASTNode, MessageBodyNode, MessageButtonNode, MessageChannelNode, MessageContentNode, MessageEmbedNode, MessageNode } from "../../types";
import { DisChordGenerator } from "../generator";
import { SubGenerator } from "../subgenerator";
import ButtonGenerator from "./MessageComponents/ButtonGenerator";
import EmbedGenerator from "./MessageComponents/EmbedGenerator";

/**
 * Generator class responsible for generating code related to message creation and interactions in DisChord.
 */
export default class MessageGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "CrearMensaje";
    
    // THIS SHOULD BE REFACTOR
    // Embed generator, responsible for generating code related to message embeds.
    private EmbedGenerator = new EmbedGenerator(this);
    // Button generator, responsible for generating code related to message buttons.
    private ButtonGenerator = new ButtonGenerator(this);

    // Expose the MessageGenerator context to component generatos.
    public MessageGeneratorContext: DisChordGenerator;

    /**
     * @param parent The context of the DisChordGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
        this.MessageGeneratorContext = parent;
    }

    /**
     * Generates code for a MessageNode, which represents a Message in DisChord.
     * @param node The MessageNode representing the message to generate code for.
     * @returns The generated code for message body.
     */
    generate (node: MessageNode): string {
        const channelNode: DisChordASTNode | undefined = node.object.blocks['canal'];
        const channel: string | undefined = channelNode ? this.visit(channelNode) : undefined;

        const contentNode: DisChordASTNode | undefined = node.object.blocks['contenido'];
        const content: string | undefined = contentNode ? this.visit(contentNode) : undefined;

        const EmbedsNode: DisChordASTNode | undefined = node.object.blocks['embed'];
        const embed: string = EmbedsNode? `, embeds: [ ${this.EmbedGenerator.generate(EmbedsNode)} ] ` : '';

        const ButtonsNode: DisChordASTNode | undefined = node.object.blocks['boton'];
        const button: string = ButtonsNode? `, components: [ new ActionRow().setComponents([ ${this.ButtonGenerator.generate(ButtonsNode)} ]) ]` : '';

        const interactionContext: string = this.parent.currentInteraction === 'interaccion' ? 'interaccion' : 'null';

        return `await createMessage(${channel}, { content: ${content} ${embed}${button} }, ${interactionContext})`;
    }
}