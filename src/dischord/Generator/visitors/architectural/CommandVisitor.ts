import { CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from '../../../../chord/Generator/SubGenerator';
import { BDOResolver } from '../../../../chord/Generator/BDOResolver';
import { CompilerMetadataKind, TokenTypeUnion } from '../../../../chord/types';
import CommandOptionVisitor from '../components/CommandOptionVisitor';
import { CommandSchema } from '../../constants/schemas';

/**
 * Generator class responsible for generating code related to command definitions.
 */
export default class CommandVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.CREAR_COMANDO;

    /**
     * Generates code for a CommandNode, which represents a command definition.
     * @param node The CommandNode representing the command definition to generate code for.
     * @returns The generated code for the command definition.
     */
    visit (node: CommandNode): string {
        // first we just add a new scope in the symboltable
        this.parent.context.symbolTable.pushScope();
        // adding interaction context
        this.parent.context.symbolTable.setMetadata(CompilerMetadataKind.IsInteraction, false); // is this necccessary yet? I need to check it

        // generating command flags & body
        const CommandName = this.getCommandName(node);
        const CommandFlags = this.generateCommandFlags(node);

        const CommandOptionVisitorData = this.parent.get(CommandOptionVisitor).visitIfNodeExists(node.body)
        const OptionsData = CommandOptionVisitorData.options;
        const OptionsConstDeclaration: string = OptionsData.length > 0? 'options = options;' : '';
        const OptionsConstExtraction: string = CommandOptionVisitorData.variables;

        const body = node.body.body
            .map((n: DisChordASTNode): string => "    " + this.parent.visit(n) + ";")
            .join('\n');

        const commandBody: string = `
            import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

            ${OptionsData}

            export default class ${CommandName}Command extends Command {
                ${CommandFlags}

                ${OptionsConstDeclaration}

                async run(contexto) {
                    const cliente = contexto.client;
                    const usuario = contexto.author;
                    const canal = contexto.interaction ? contexto.interaction.channel : cliente.channels.fetch(contexto.channelId);
                    const ctx = { cliente, contexto };

                    ${OptionsConstExtraction}

                    ${body}
                }
            }
        `;

        // deleting scope from symboltable
        this.parent.context.symbolTable.popScope();

        return commandBody;
    }

    /**
     * Generates class property assignments string representing the command configuration flags.
     * Every flag but `name` comes straight out of `CommandSchema` via `BDOResolver` — the same
     * schema the Analyzer's `ValidateCommandRule` already validated `node.body` against, so
     * there's nothing left here to re-check, only to interpolate.
     *
     * @private
     * @param {CommandNode} node - The AST command node containing properties to evaluate.
     * @returns {string} Processed source code defining class flags (name, description, nsfw, etc.).
     */
    private generateCommandFlags(node: CommandNode): string {
        const CommandName = this.getCommandName(node).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() /*slugified*/

        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));
        const flags = resolver.resolve(node.body, CommandSchema);

        return `
            name = "${CommandName}";
            description = ${flags['descripcion']};
            nsfw = ${flags['nsfw']};
            integrationTypes = ${flags['integraciones']};
            contexts = ${flags['contextos']};
            guildId = ${flags['servidoresPermitidos']};
            ignore = ${flags['ignorar']};
            aliases = ${flags['alias']};
        `;
    }

    /**
     * Extracts the identifier name of the command from the AST node.
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} The name of the command.
     */
    private getCommandName (node: CommandNode): string {
        return node.value;
    }
}
