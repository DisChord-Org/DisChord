import { DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../../types";
import { SubGenerator } from '../../../../chord/Generator/SubGenerator';
import { TokenTypeUnion } from '../../../../chord/model/types';
import { VisitorHelpers } from "../VisitorHelpers";
import { eventParamNames, eventParamSignature, eventsMap } from '../../constants/mappings';

/**
 * Generator class responsible for generating code related to listeners in DisChord.
 */
export default class EventVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.EVENTO;
    
    /**
     * Generates code for a EventNode, which represents a listener in DisChord. `node.name`'s
     * validity is guaranteed by the Analyzer's `ValidateEventRule`.
     * @param node The EventNode representing the listener to generate code for.
     * @returns The generated code for the listener.
     */
    visit (node: EventNode): string {
        const event = eventsMap[node.name];

        // reopening the scope the analyzer bound to this event
        this.parent.context.symbolTable.enterScope(node);

        const body = VisitorHelpers.renderStatements(this.parent, node.body);

        this.parent.context.symbolTable.exitScope();

        const guard = event.guard ? `if (${event.guard}) return;` : '';
        const derived = Object.entries(event.derived ?? {}).map(([ name, expression ]) => `const ${name} = ${expression};`).join('\n');

        const ctxParams = eventParamNames(event).filter(param => param === 'cliente' || param === 'mensaje');
        const ctxDeclaration = `const ctx = { ${ctxParams.join(', ')} };`;

        const eventBody: string = `
            import { createEvent, Embed, ActionRow, Button } from 'seyfert';

            export default createEvent({
                data: { name: '${event.name}' },
                async run(${eventParamSignature(event)}) {
                ${guard}
                ${derived}
                ${ctxDeclaration}
                ${body}
                }
            });
        `;

        return eventBody;
    }
}