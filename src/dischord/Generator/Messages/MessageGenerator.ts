import { MessageBodyNode, MessageButtonNode, MessageChannelNode, MessageContentNode, MessageEmbedNode, MessageNode } from "../../types";
import { DisChordGenerator } from "../generator";
import ButtonGenerator from "./MessageComponents/ButtonGenerator";
import EmbedGenerator from "./MessageComponents/EmbedGenerator";

export default class MessageGenerator {
    private EmbedGenerator = new EmbedGenerator(this);
    private ButtonGenerator = new ButtonGenerator(this);

    public MessageGeneratorContext: DisChordGenerator;

    constructor (private ctx: DisChordGenerator) {
        this.MessageGeneratorContext = ctx;
    }

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