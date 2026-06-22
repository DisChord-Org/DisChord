import { DisChordNode, DisChordNodeType, DisChordTokenType, MessageNode } from "../../../types";
import { DisChordGenerator } from "../../Generator";
import { SubGenerator, SubGeneratorClass } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";

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
     * @param parent The context of the DisChordGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

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

        const ComponentsData = this.Components
            .map(generator => new generator(this.parent).generateIfNodeExists(node.object))
            .join('');

        const interactionContext: string = this.parent.currentInteraction === 'interaccion' ? 'interaccion' : 'null';

        return `await createMessage(${channel}, { content: ${content} ${ComponentsData} }, ${interactionContext})`;
    }
}