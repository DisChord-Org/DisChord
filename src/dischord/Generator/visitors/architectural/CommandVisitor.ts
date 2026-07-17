import { join } from 'path';
import Prettifier from '../../../../init/Prettifier';

import { createMessageFunctionInjection } from "../../../core.lib";
import { CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from '../../../../chord/Generator/SubGenerator';
import { DisChordError, ErrorLevel } from '../../../../ChordError';
import { TokenTypeUnion } from '../../../../chord/types';
import { BDOVisitor } from '../../../../chord/Generator/visitors/expressions/BDOVisitor';
import CommandOptionVisitor from '../components/CommandOptionVisitor';
import { DisChordGenerator } from '../../Generator';

/**
 * Generator class responsible for generating code related to command definitions in DisChord.
 */
export default class CommandVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.CREAR_COMANDO;
    
    /**
     * Generates code for a CommandNode, which represents a command definition in DisChord.
     * @param node The CommandNode representing the command definition to generate code for.
     * @returns The generated code for the command definition.
     */
    visit (node: CommandNode): string {
        const commandName = node.value;
        const commandDescription = this.parent.get(BDOVisitor).getODBProperty(node.body, 'descripcion');
        if (!commandDescription) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se requiere descripción para el comando`,
            location: node.location
        }).format();

        const CommandOptionVisitorData = this.parent.get(CommandOptionVisitor).visitIfNodeExists(node.body)
        const OptionsData = CommandOptionVisitorData.options;
        const OptionsConstDeclaration: string = OptionsData.length > 0? 'options = options;' : '';
        const OptionsConstExtraction: string = CommandOptionVisitorData.variables;

        const body = node.body.body
            .map((n: DisChordASTNode): string => "    " + (this.parent as DisChordGenerator).visit(n, { isInteraction: false }) + ";")
            .join('\n');

        const commandBody: string = `
            import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

            ${OptionsData}

            export default class ${commandName}Command extends Command {
                name = "${commandName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() /*slugified*/}";
                description = ${this.parent.visit(commandDescription) ?? '"Un comando genial"'};
                ignore = IgnoreCommand.Message;
                integrationTypes = [ 0 ];
                contexts = [ 0 ];
                ${OptionsConstDeclaration}
                async run(ctx) {
                    const contexto = ctx;
                    const cliente = contexto.client;
                    const usuario = contexto.author;
                    const canal = contexto.interaction.channel;
                    ${OptionsConstExtraction}

                    ${createMessageFunctionInjection}

                    ${body}
                }
            }
        `;

        Prettifier.savePrettified(join(this.parent.context.projectRoot, 'dist', 'commands', `${commandName}.js`), commandBody)
        return '';
    }
}