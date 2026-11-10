import { CommandNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { GeneratedNames } from "../../constants/GeneratedNames";
import { SubGenerator } from '../../../../chord/Generator/SubGenerator';
import { VisitorHelpers } from "../VisitorHelpers";
import { CompilerMetadataKind, TokenTypeUnion } from '../../../../chord/model/types';
import CommandOptionVisitor from '../components/CommandOptionVisitor';
import { CommandSchema } from '../../constants/schemas';
import { CommandContextParameter, CommandScope } from '../../constants/mappings';
import { slugifyCommandName } from '../../constants/commandNames';
import { CommandScopeNames } from '../../../CommandScopeNames';

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
        // reopening the scope the analyzer bound to this command
        this.parent.context.symbolTable.enterScope(node);
        // adding interaction context
        // read by MessageVisitor to pick the interaction argument of createMessage
        this.parent.context.symbolTable.setMetadata(CompilerMetadataKind.IsInteraction, false);

        // generating command flags & body
        const commandName = node.value;
        const commandFlags = this.generateCommandFlags(node);

        const optionData = this.parent.get(CommandOptionVisitor).visitIfNodeExists(node.body);
        const optionsData = optionData.options;
        const optionsConstDeclaration: string = optionsData.length > 0? `${GeneratedNames.OptionsConstantName} = ${GeneratedNames.OptionsConstantName};` : '';
        const optionsConstExtraction: string = optionData.variables;

        // an option named like an injected name wins: it is declared with the other options below, and
        // declaring both in the same scope would be a SyntaxError
        const scopeDeclarations = CommandScopeNames.declaredInjected(node.body)
            .map(name => `const ${name} = ${CommandScope[name]};`)
            .join('\n');

        const body = VisitorHelpers.renderStatements(this.parent, node.body.body);

        const commandBody: string = `
            ${GeneratedNames.importStatement('command')}

            ${optionsData}

            export default class ${GeneratedNames.commandClassName(commandName)} extends Command {
                ${commandFlags}

                ${optionsConstDeclaration}

                async run(${CommandContextParameter}) {
                    ${scopeDeclarations}

                    ${optionsConstExtraction}

                    ${body}
                }
            }
        `;

        this.parent.context.symbolTable.exitScope();

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
        const commandName = slugifyCommandName(node.value);

        const resolver = VisitorHelpers.resolverFor(this.parent);
        const flags = resolver.resolve(node.body, CommandSchema);

        return `
            name = "${commandName /* slugified */}";
            description = ${flags['descripcion']};
            nsfw = ${flags['nsfw']};
            integrationTypes = ${flags['integraciones']};
            contexts = ${flags['contextos']};
            guildId = ${flags['servidoresPermitidos']};
            ignore = ${flags['ignorar']};
            aliases = ${flags['alias']};
        `;
    }
}
