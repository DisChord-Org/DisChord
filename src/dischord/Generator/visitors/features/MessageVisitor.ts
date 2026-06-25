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
     * Internal state tracker dictating whether the message composition is executed 
     * within an active Discord interaction gateway pipeline context.
     * @private
     * @type {boolean}
     */
    private isInteractionContext: boolean = false;

    /**
     * Fluent state modifier that configures the interaction context flag for the current execution cycle.
     * Allows method chaining during dynamic AST sub-generator instantiation.
     * @param {boolean} value - True if the node is being evaluated inside an interaction-driven block (e.g., Commands, Buttons).
     * @returns {this} The current visitor instance for semantic method chaining fluency.
     * @public
     */
    public setInteraction(value: boolean): this {
        this.isInteractionContext = value;
        return this;
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

        const Button = this.parent.get(ButtonVisitor).visitIfNodeExists(node.object);
        const Embed = this.parent.get(EmbedVisitor).visitIfNodeExists(node.object);

        const ComponentsData = [ Button, Embed ].join('');
        const interactionContext: string = this.isInteractionContext? 'interaccion' : 'null';

        return `await createMessage(${channel}, { content: ${content} ${ComponentsData} }, ${interactionContext})`;
    }
}