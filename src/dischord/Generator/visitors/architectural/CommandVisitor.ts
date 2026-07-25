import { join } from 'path';
import Prettifier from '../../../../init/Prettifier';

import { createMessageFunctionInjection } from "../../../core.lib";
import { ApplicationIntegrationType, CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, InteractionContextType } from "../../../types";
import { SubGenerator } from '../../../../chord/Generator/SubGenerator';
import { DisChordError, ErrorLevel } from '../../../../ChordError';
import { CompilerMetadataKind, TokenTypeUnion } from '../../../../chord/types';
import { BDOVisitor } from '../../../../chord/Generator/visitors/expressions/BDOVisitor';
import CommandOptionVisitor from '../components/CommandOptionVisitor';
import { ContextTypes, IgnoreCommandTypes, IntegrationTypes } from '../../constants/mappings';

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
        this.parent.context.symbolTable.setMetadata(CompilerMetadataKind.IsInteraction, false);

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

                    ${OptionsConstExtraction}

                    ${createMessageFunctionInjection}

                    ${body}
                }
            }
        `;

        Prettifier.savePrettified(join(this.parent.context.projectRoot, 'dist', 'commands', `${CommandName}.js`), commandBody);
        
        // deleting scope from symboltable
        this.parent.context.symbolTable.popScope();
        
        return '';
    }

    /**
     * Generates class property assignments string representing the command configuration flags.
     *
     * @private
     * @param {CommandNode} node - The AST command node containing properties to evaluate.
     * @returns {string} Processed source code defining class flags (name, description, nsfw, etc.).
     */
    private generateCommandFlags(node: CommandNode): string {
        const CommandName = this.getCommandName(node).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() /*slugified*/
        const CommandDescription = this.getCommandDescription(node);
        const isNsfw = this.isNsfw(node);
        const integrationTypes = this.getIntegrationTypes(node);
        const contextTypes = this.getContextTypes(node);
        const guilds = this.getAllowedGuildIds(node);
        const ignoredType = this.getIgnoredContext(node);
        const aliases = this.getAliases(node);

        return `
            name = "${CommandName}";
            description = ${CommandDescription};
            nsfw = ${isNsfw};
            integrationTypes = ${integrationTypes};
            contexts = ${contextTypes};
            guildId = ${guilds};
            ignore = ${ignoredType};
            aliases = ${aliases};
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

    /**
     * Retrieves and parses the command description from the AST node body.
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} Generated expression representing the command description.
     * @throws {DisChordError} Throws a compiler error if the description property is missing.
     */
    private getCommandDescription (node: CommandNode): string {
        const CommandDescription = this.parent.get(BDOVisitor).getODBProperty(node.body, 'descripcion');

        if (!CommandDescription) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se requiere descripción para el comando`,
            location: node.location
        }).format();

        return this.parent.visit(CommandDescription);
    }

    /**
     * Evaluates whether the command is flagged as NSFW.
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} String expression evaluating to 'true' or 'false'.
     */
    private isNsfw (node: CommandNode): string {
        const isNsfw = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node.body, 'nsfw')
        );

        return isNsfw || 'false';
    }

    /**
     * Helper method to parse and translate AST array property values against a mapping object.
     *
     * @private
     * @param {Object} config - Configuration object parameters.
     * @param {CommandNode} config.node - The target command AST node.
     * @param {'integraciones' | 'contextos'} config.fieldName - Property name inside the AST node body to parse.
     * @param {Record<string, InteractionContextType | ApplicationIntegrationType>} config.mapping - Mapping table to validate and convert string tokens to enum values.
     * @param {InteractionContextType | ApplicationIntegrationType} config.defaultValue - Default enum value fallback if property is omitted.
     * @returns {string} String representation of array containing resolved numeric enum values.
     * @throws {DisChordError} Throws a compiler error if the property is not a list, contains non-string elements, or uses unsupported option tokens.
     */
    private getMappedListOption (config: {
        node: CommandNode,
        fieldName: 'integraciones' | 'contextos',
        mapping: Record<string, InteractionContextType | ApplicationIntegrationType>,
        defaultValue: InteractionContextType | ApplicationIntegrationType
    }): string {
        const { node, mapping, defaultValue, fieldName } = config;

        const field = this.parent.get(BDOVisitor).getODBProperty(node.body, fieldName);
        if (!field) return `[ ${defaultValue} ]`;

        if (field.type !== 'Lista') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `El campo '${fieldName}' debe ser una lista de opciones`,
            location: field.location
        }).format();

        const translatedValues = field.body.map((literal): number => {
            if (literal.type !== 'Literal' || typeof literal.value !== 'string') throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `Solo se permite especificar tipo TEXTO en ${fieldName}`,
                location: literal.location
            }).format();

            const mappedValue = mapping[literal.value];

            if (mappedValue === undefined) throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `En las integraciones solo se puede especificar: ${Object.keys(mapping).join(' / ')}`,
                location: literal.location
            }).format();

            return mappedValue;
        });

        return `[ ${translatedValues.join(', ')} ]`;
    }

    /**
     * Resolves the allowed integration types for the command.
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} Stringified array of mapped integration type enum values.
     */
    private getIntegrationTypes (node: CommandNode): string {
        return this.getMappedListOption({
            node,
            fieldName: 'integraciones',
            mapping: IntegrationTypes,
            defaultValue: ApplicationIntegrationType.GuildInstall
        });
    }

    /**
     * Resolves the execution contexts where the command is applicable.
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} Stringified array of mapped context type enum values.
     */
    private getContextTypes (node: CommandNode): string {
        return this.getMappedListOption({
            node,
            fieldName: 'contextos',
            mapping: ContextTypes,
            defaultValue: InteractionContextType.Guild
        });
    }

    /**
     * Resolves the target guild IDs assigned to this command, if restricted.
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} Generated expression representing guild IDs array or 'undefined'.
     */
    private getAllowedGuildIds (node: CommandNode): string {
        const guilds = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node.body, 'servidoresPermitidos')
        );

        return guilds || 'undefined';
    }

    /**
     * Resolves command execution exclusion rules (e.g., ignoring slash or message execution).
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} Stringified mapped ignore type enum value or 'undefined'.
     * @throws {DisChordError} Throws a compiler error if value is not string or not present in mapping.
     */
    private getIgnoredContext (node: CommandNode): string {
        const literal = this.parent.get(BDOVisitor).getODBProperty(node.body, 'ignorar');
        if (!literal) return 'undefined';

        if (literal.type != 'Literal' || typeof literal.value != 'string') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Solo se permite tipo TEXTO en 'ignorar'`,
            location: literal.location
        }).format();

        const mappedValue = IgnoreCommandTypes[literal.value];

        if (mappedValue === undefined) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `En 'ignorar' solo se puede especificar un TEXTO de: ${Object.keys(IgnoreCommandTypes).join(' / ')}`,
            location: literal.location
        }).format();

        return `${mappedValue}`;
    }

    /**
     * Resolves alternative command aliases defined in the AST node.
     *
     * @private
     * @param {CommandNode} node - The target command AST node.
     * @returns {string} Generated array expression containing aliases or 'undefined'.
     * @throws {DisChordError} Throws a compiler error if aliases property is not a list node.
     */
    private getAliases (node: CommandNode): string {
        const literal = this.parent.get(BDOVisitor).getODBProperty(node.body, 'alias');
        if (!literal) return 'undefined';

        if (literal.type != 'Lista') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Los alias deben ser una LISTA con valores tipo TEXTO`,
            location: literal.location
        }).format();

        return this.parent.visit(literal);
    }
}
