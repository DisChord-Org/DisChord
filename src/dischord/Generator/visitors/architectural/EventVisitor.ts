import { createMessageModulePath } from "../../../core.lib";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../../types";
import { SubGenerator } from '../../../../chord/Generator/SubGenerator';
import { DisChordError, ErrorLevel } from '../../../../errors/ChordError';
import { CompilerMetadataKind, TokenTypeUnion } from '../../../../chord/types';
import { eventsMap } from '../../constants/mappings';

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
     * Generates code for a EventNode, which represents a listener in DisChord.
     * @param node The EventNode representing the listener to generate code for.
     * @returns The generated code for the listener.
     */
    visit (node: EventNode): string {
        const eventName = eventsMap[node.name]?.name;
        if (!eventName) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `El evento '${node.name}' no existe`,
            location: node.location
        }).format();

        const body = node.body
            .map((n: DisChordASTNode): string => "    " + this.parent.visit(n) + ";")
            .join('\n');

        const needsMessageHelper = this.parent.context.symbolTable.getMetadata<boolean>(CompilerMetadataKind.RequiresMessageHelper);

        const messageImport = needsMessageHelper ? `import { createMessage } from '../${createMessageModulePath}';` : '';
        const ctxParams = eventsMap[node.name].params.filter(param => param === 'cliente' || param === 'mensaje');
        const ctxDeclaration = `const ctx = { ${ctxParams.join(', ')} };`;

        const eventBody: string = `
            import { createEvent, Embed, ActionRow, Button } from 'seyfert';
            ${messageImport}

            export default createEvent({
                data: { name: '${eventName}' },
                async run(${eventsMap[node.name].params.join(', ')}) {
                ${ctxDeclaration}
                ${body}
                }
            });
        `;

        return eventBody;
    }
}