import { DisChordNode, DisChordNodeType, DisChordTokenType, MessageNode } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { BDOResolver } from "../../../../chord/Generator/BDOResolver";
import { CompilerMetadataKind, TokenTypeUnion } from "../../../../chord/types";
import ButtonVisitor from "../components/ButtonVisitor";
import EmbedVisitor from "../components/EmbedVisitor";
import { MessageSchema } from "../../constants/schemas";

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
        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));
        const properties = resolver.resolve(node.object, MessageSchema);

        const Button = this.parent.get(ButtonVisitor).visitIfNodeExists(node.object);
        const Embed = this.parent.get(EmbedVisitor).visitIfNodeExists(node.object);

        const ComponentsData = [ Button, Embed ].join('');
        const interactionContext: string = this.parent.context.symbolTable.getMetadata<boolean>(CompilerMetadataKind.IsInteraction)? 'interaccion' : 'null';

        return `await createMessage(${properties['canal']}, { content: ${properties['contenido']} ${ComponentsData} }, ${interactionContext}, ctx)`;
    }
}