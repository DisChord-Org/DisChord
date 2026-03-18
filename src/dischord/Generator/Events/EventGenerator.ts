import { join } from 'path';
import fs from 'fs';

import { ASTNode } from "../../../chord/types";
import { createMessageFunctionInjection, eventsMap } from "../../core.lib";
import { EventNode } from "../../types";
import { DisChordGenerator } from "../generator";

/**
 * Generator class responsible for generating code related to listeners in DisChord.
 */
export default class EventGenerator {
    /**
     * Constructor for the EventGenerator class.
     * @param ctx The context of the DisChordGenerator.
     */
    constructor (private ctx: DisChordGenerator) {}

    /**
     * Generates code for a EventNode, which represents a listener in DisChord.
     * @param node The EventNode representing the listener to generate code for.
     * @returns The generated AST for the listener.
     */
    generate (node: EventNode): string {
        const eventName = eventsMap[node.name]?.name;
        if (!eventName) throw new Error(`El evento ${node.name} no existe`);

        const body = node.body
            .map((n: ASTNode): string => "    " + this.ctx.visit(n) + ";")
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

        fs.writeFileSync(join(this.ctx.projectRooth, 'dist', 'events', `${eventName}.js`), eventBody, 'utf-8');

        return '';
    }
}