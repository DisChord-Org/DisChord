import { join } from 'path';
import Prettifier from '../../../init/Prettifier';

import { createMessageFunctionInjection } from "../../core.lib";
import { CommandNode, CommandOptionNode, CommandParam, DisChordASTNode } from "../../types";
import { DisChordGenerator } from "../generator";
import { SubGenerator } from '../subgenerator';
import { DisChordError, ErrorLevel } from '../../../ChordError';

/**
 * Generator class responsible for generating code related to command definitions in DisChord.
 */
export default class CommandGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "CrearComando";
    
    /**
     * Constructor for the CommandGenerator class.
     * @param parent The context of the DisChordGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    /**
     * Generates code for a CommandNode, which represents a command definition in DisChord.
     * @param node The CommandNode representing the command definition to generate code for.
     * @returns The generated code for the command definition.
     */
    generate (node: CommandNode): string {
        const commandName = node.value;
        const commandDescription = node.params.find((param: CommandParam) => param.property === 'Descripcion');
        if (!commandDescription) throw new DisChordError(
            ErrorLevel.Compiler,
            `Se requiere descripción para el comando`,
            node.location,
            this.parent.input.split('\n')[node.location.line - 1] || ''
        ).format();
        
        const OptionsNode: CommandOptionNode[] | undefined = node.params.find((param: CommandParam) => param.property === 'Opciones')?.options;
        const OptionsString: string = OptionsNode? `const options = [${OptionsNode.map((option: CommandOptionNode) => this.generateOption(option)).join(',')}];` : '';
        const OptionsConstDeclaration: string = OptionsNode? 'options = options;' : '';
        const OptionsConstExtraction: string = OptionsNode? OptionsNode.map((option: CommandOptionNode) => `const ${option.name} = ctx.options.${option.name};`).join('\n') : '';

        const body = node.body
            .map((n: DisChordASTNode): string => "    " + this.visit(n) + ";")
            .join('\n');

        const commandBody: string = `
            import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

            ${OptionsString}

            export default class ${commandName}Command extends Command {
                name = "${commandName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() /*slugified*/}";
                description = ${this.visit(commandDescription.value) ?? '"Un comando genial"'};
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

        Prettifier.savePrettified(join(this.parent.projectRoot, 'dist', 'commands', `${commandName}.js`), commandBody)
        return '';
    }

    /**
     * Generates the code for a command option based on the provided CommandOptionNode.
     * @param option The CommandOptionNode representing the command option to generate code for.
     * @returns The generated AST for the command option.
     */
    private generateOption(option: CommandOptionNode): string {
        const name = option.name;
        const description = this.visit(option.description);
        const required = option.required ? 'true' : 'false';

        // Currently, only string options are supported. This can be expanded in the future to support more types.
        return `
            {
                name: "${name}",
                description: ${description},
                required: ${required},
                type: 3
            }
        `;
    }
}