import { DisChordNode, DisChordNodeType, DisChordTokenType, MessageNode } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";
import ButtonVisitor from "../components/ButtonVisitor";
import EmbedVisitor from "../components/EmbedVisitor";

/**
 * Generator class responsible for generating code related to message creation and interactions in DisChord.
 */
export default class MessageVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.CREAR_MENSAJE;

    /**
     * Generates code for a MessageNode, which represents a Message in DisChord.
     * @param node The MessageNode representing the message to generate code for.
     * @returns The generated code for message body.
     */
    visit (node: MessageNode): string {
        const channel: string | undefined = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node.object, 'canal')
        );

        const content: string | undefined = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node.object, 'contenido')
        );

        const Button = this.parent.get(ButtonVisitor).visitIfNodeExists(node.object);
        const Embed = this.parent.get(EmbedVisitor).visitIfNodeExists(node.object);

        const ComponentsData = [ Button, Embed ].join('');

        const interactionContext: string = this.parent.currentInteraction === 'interaccion' ? 'interaccion' : 'null';

        return `await createMessage(${channel}, { content: ${content} ${ComponentsData} }, ${interactionContext})`;
    }
}