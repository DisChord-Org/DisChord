import { MessageBodyNode, MessageButtonNode, MessageChannelNode, MessageContentNode, MessageEmbedNode, MessageNode } from "../../types";
import { DisChordGenerator } from "../generator";
import ButtonGenerator from "./MessageComponents/ButtonGenerator";
import EmbedGenerator from "./MessageComponents/EmbedGenerator";

/**
 * Generator class responsible for generating code related to message creation and interactions in DisChord.
 */
export default class MessageGenerator {
    // Embed generator, responsible for generating code related to message embeds.
    private EmbedGenerator = new EmbedGenerator(this);
    // Button generator, responsible for generating code related to message buttons.
    private ButtonGenerator = new ButtonGenerator(this);

    // Expose the MessageGenerator context to component generatos.
    public MessageGeneratorContext: DisChordGenerator;

    /**
     * @param ctx The context of the DisChordGenerator.
     */
    constructor (private ctx: DisChordGenerator) {
        this.MessageGeneratorContext = ctx;
    }

    /**
     * Generates code for a MessageNode, which represents a Message in DisChord.
     * @param node The MessageNode representing the message to generate code for.
     * @returns The generated AST for message body.
     */
    generate (node: MessageNode): string {
        const channelNode: MessageChannelNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'canal');
        const channel: string | undefined = channelNode ? this.ctx.visit(channelNode.channel) : undefined;
        const contentNode: MessageContentNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'contenido');
        const content: string | undefined = contentNode ? this.ctx.visit(contentNode.content) : undefined;
        const EmbedsNode: MessageEmbedNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'embed');
        const embed: string = EmbedsNode? `, embeds: [ ${this.EmbedGenerator.generate(EmbedsNode.embed)} ] ` : '';
        const ButtonsNode: MessageButtonNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'boton');
        const button: string = ButtonsNode? `, components: [ new ActionRow().setComponents([ ${this.ButtonGenerator.generate(ButtonsNode)} ]) ]` : '';
        const interactionContext: string = this.ctx.currentInteraction === 'interaccion' ? 'interaccion' : 'null';

        return `await createMessage(${channel}, { content: ${content} ${embed}${button} }, ${interactionContext})`;
    }
}