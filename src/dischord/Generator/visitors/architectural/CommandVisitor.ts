import { join } from 'path';
import Prettifier from '../../../../init/Prettifier';

import { createMessageFunctionInjection } from "../../../core.lib";
import { ApplicationIntegrationType, CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, InteractionContextType } from "../../../types";
import { SubGenerator } from '../../../../chord/Generator/SubGenerator';
import { DisChordError, ErrorLevel } from '../../../../ChordError';
import { CompilerMetadataKind, TokenTypeUnion } from '../../../../chord/types';
import { BDOVisitor } from '../../../../chord/Generator/visitors/expressions/BDOVisitor';
import CommandOptionVisitor from '../components/CommandOptionVisitor';
import { ContextTypes, IntegrationTypes } from '../../constants/mappings';

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

        Prettifier.savePrettified(join(this.parent.context.projectRoot, 'dist', 'commands', `${CommandName}.js`), commandBody);
        
        // deleting scope from symboltable
        this.parent.context.symbolTable.popScope();
        
        return '';
    }

    private generateCommandFlags(node: CommandNode): string {
        const CommandName = this.getCommandName(node).replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() /*slugified*/
        const CommandDescription = this.getCommandDescription(node);
        const isNsfw = this.isNsfw(node);
        const integrationTypes = this.getIntegrationTypes(node);
        const contextTypes = this.getContextTypes(node);

        return `
            name = "${CommandName}";
            description = ${CommandDescription};
            nsfw = ${isNsfw};
            integrationTypes = ${integrationTypes};
            contexts = ${contextTypes};
            ignore = IgnoreCommand.Message;
        `;
    }

    private getCommandName (node: CommandNode): string {
        return node.value;
    }

    private getCommandDescription (node: CommandNode): string {
        const CommandDescription = this.parent.get(BDOVisitor).getODBProperty(node.body, 'descripcion');

        if (!CommandDescription) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se requiere descripción para el comando`,
            location: node.location
        }).format();

        return this.parent.visit(CommandDescription);
    }

    private isNsfw (node: CommandNode): string {
        const isNsfw = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node.body, 'nsfw')
        );

        return isNsfw || 'false';
    }

    private getIntegrationTypes (node: CommandNode): string {
        const integrationTypes = this.parent.get(BDOVisitor).getODBProperty(node.body, 'integraciones');

        if (!integrationTypes) return `[ ${ApplicationIntegrationType.GuildInstall} ]`;

        if (integrationTypes.type !== 'Lista') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `El campo 'integraciones' debe ser una lista de opciones`,
            location: integrationTypes.location
        }).format();

        const translatedValues = integrationTypes.body.map((literal): number => {
            if (literal.type !== 'Literal' || typeof literal.value !== 'string') throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `Solo se permite especificar tipo TEXTO en las integraciones`,
                location: literal.location
            }).format();

            const mappedValue = IntegrationTypes[literal.value];

            if (mappedValue === undefined) throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `En las integraciones solo se puede especificar: ${Object.keys(integrationTypes).join(' / ')}`,
                location: literal.location
            }).format();

            return mappedValue;
        });

        return `[ ${translatedValues.join(', ')} ]`;
    }

    private getContextTypes (node: CommandNode): string {
        const contextTypes = this.parent.get(BDOVisitor).getODBProperty(node.body, 'contextos');

        if (!contextTypes) return `[ ${InteractionContextType.Guild} ]`;

        if (contextTypes.type !== 'Lista') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `El campo 'contextos' debe ser una lista de opciones`,
            location: contextTypes.location
        }).format();

        const translatedValues = contextTypes.body.map((literal): number => {
            if (literal.type !== 'Literal' || typeof literal.value !== 'string') throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `Solo se permite especificar tipo TEXTO en las integraciones`,
                location: literal.location
            }).format();

            const mappedValue = ContextTypes[literal.value];

            if (mappedValue === undefined) throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `En los contextos solo se puede especificar: ${Object.keys(contextTypes).join(' / ')}`,
                location: literal.location
            }).format();

            return mappedValue;
        });

        return `[ ${translatedValues.join(', ')} ]`;
    }
}