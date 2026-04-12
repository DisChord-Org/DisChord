import { join } from 'path';
import Prettifier from '../../../init/Prettifier';

import { createMessageFunctionInjection, eventsMap } from "../../core.lib";
import { DisChordASTNode, EventNode } from "../../types";
import { DisChordGenerator } from "../generator";
import { SubGenerator } from '../subgenerator';
import { DisChordError, ErrorLevel } from '../../../ChordError';

/**
 * Generator class responsible for generating code related to listeners in DisChord.
 */
export default class EventGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "Evento";
    
    /**
     * Constructor for the EventGenerator class.
     * @param parent The context of the DisChordGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    /**
     * Generates code for a EventNode, which represents a listener in DisChord.
     * @param node The EventNode representing the listener to generate code for.
     * @returns The generated code for the listener.
     */
    generate (node: EventNode): string {
        const eventName = eventsMap[node.name]?.name;
        if (!eventName) throw new DisChordError(
            ErrorLevel.Compiler,
            `El evento '${node.name}' no existe`,
            node.location,
            this.parent.input.split('\n')[node.location.line - 1] || ''
        ).format();

        const body = node.body
            .map((n: DisChordASTNode): string => "    " + this.visit(n) + ";")
            .join('\n');

        const eventBody: string = `
            import { createEvent, Embed, ActionRow, Button } from 'seyfert';

            export default createEvent({
                data: { name: '${eventName}' },
                async run(${eventsMap[node.name].params.join(', ')}) {
                ${createMessageFunctionInjection}
                ${body}
                }
            });
        `;

        Prettifier.savePrettified(join(this.parent.projectRoot, 'dist', 'events', `${eventName}.js`), eventBody);

        return '';
    }
}