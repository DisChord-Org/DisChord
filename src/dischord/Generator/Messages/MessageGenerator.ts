import { MessageNode } from "../../types";
import { DisChordGenerator } from "../generator";
import { SubGenerator, SubGeneratorClass } from "../subgenerator";
import ButtonGenerator from "./MessageComponents/ButtonGenerator";
import EmbedGenerator from "./MessageComponents/EmbedGenerator";

/**
 * Generator class responsible for generating code related to message creation and interactions in DisChord.
 */
export default class MessageGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "CrearMensaje";
    
    /**
     * The inventory of specialists.
     * Adding a class here will register it into the all system.
     */
    private readonly Components: SubGeneratorClass[] = [
        EmbedGenerator,
        ButtonGenerator
    ];

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
        const channel: string | undefined = this.visitIfExists(
            this.getODBProperty(node.object, 'canal')
        );

        const content: string | undefined = this.visitIfExists(
            this.getODBProperty(node.object, 'contenido')
        );

        const ComponentsData = this.Components
            .map(generator => new generator(this.parent).generateIfNodeExists(node.object))
            .join('');

        const interactionContext: string = this.parent.currentInteraction === 'interaccion' ? 'interaccion' : 'null';

        return `await createMessage(${channel}, { content: ${content} ${ComponentsData} }, ${interactionContext})`;
    }
}