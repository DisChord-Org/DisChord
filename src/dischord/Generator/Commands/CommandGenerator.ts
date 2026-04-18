import { join } from 'path';
import Prettifier from '../../../init/Prettifier';

import { createMessageFunctionInjection } from "../../core.lib";
import { CommandNode, DisChordASTNode } from "../../types";
import { DisChordGenerator } from "../generator";
import { SubGenerator, SubGeneratorClass } from '../subgenerator';
import { DisChordError, ErrorLevel } from '../../../ChordError';
import CommandOptionGenerator from './CommandOptions/CommandOption';

/**
 * Generator class responsible for generating code related to command definitions in DisChord.
 */
export default class CommandGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "CrearComando";

    // Expose the CommandGenerator context to options generator.
    public CommandGeneratorContext: DisChordGenerator;
    
    /**
     * Constructor for the CommandGenerator class.
     * @param parent The context of the DisChordGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
        this.CommandGeneratorContext = parent;
    }

    /**
     * Generates code for a CommandNode, which represents a command definition in DisChord.
     * @param node The CommandNode representing the command definition to generate code for.
     * @returns The generated code for the command definition.
     */
    generate (node: CommandNode): string {
        const commandName = node.value;
        const commandDescription = this.getODBProperty(node.body, 'descripcion');
        if (!commandDescription) throw new DisChordError(
            ErrorLevel.Compiler,
            `Se requiere descripción para el comando`,
            node.location
        ).format();

        const CommandOptionGeneratorInstance = new CommandOptionGenerator(this.parent);
        const OptionsData = CommandOptionGeneratorInstance.generateIfNodeExists(node.body);
        const OptionsConstDeclaration: string = OptionsData.length > 0? 'options = options;' : '';
        const OptionsConstExtraction: string = CommandOptionGeneratorInstance.getExtractionCode();

        const body = node.body.body
            .map((n: DisChordASTNode): string => "    " + this.visit(n) + ";")
            .join('\n');

        const commandBody: string = `
            import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

            ${OptionsData}

            export default class ${commandName}Command extends Command {
                name = "${commandName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() /*slugified*/}";
                description = ${this.visit(commandDescription) ?? '"Un comando genial"'};
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
}