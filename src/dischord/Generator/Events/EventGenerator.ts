import { join } from 'path';
import fs from 'fs';

import { ASTNode } from "../../../chord/types";
import { createMessageFunctionInjection, eventsMap } from "../../core.lib";
import { EventNode } from "../../types";
import { DisChordGenerator } from "../generator";

export default class EventGenerator {
    constructor (private ctx: DisChordGenerator) {}

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