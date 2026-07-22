import { DisChordError, ErrorLevel } from "../../../../ChordError";
import { DisChordTypeMap } from "../../constants/mappings";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, DiscordOptionType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";

/**
 * Data structure representing the complete output of the command option processing phase.
 */
export interface CommandOptionsOutput {
    /** The code for the array that Seyfert expects*/
    options: string;
    /** The code for extracting variables from context */
    variables: string;
}

/**
 * Specialist generator responsible for parsing and translating DisChord command options 
 * into Discord-compatible API structures.
 */
export default class CommandOptionVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = undefined;

    /**
     * Entry point for the CommandGenerator. Checks if the 'opciones' block exists 
     * within the provided ODB and initiates generation.
     * @param node The Object Definition Block (BDO) of the command.
     * @returns {CommandOptionsOutput} The 'options' and 'variables' constants as object.
     */
    public visitIfNodeExists (node: DisChordODBNode): CommandOptionsOutput {
        const optionsBlock = this.parent.get(BDOVisitor).getODBProperty(node, 'opciones');

        if (!optionsBlock || optionsBlock.type !== 'BDO') return {
            options: '',
            variables: ''
        };

        return {
            options: `const options = [${this.visit(optionsBlock)}];`,
            variables: this.generateVariables(optionsBlock)
        };
    }

    /**
     * Iterates through the options defined in the DisChord source and maps them 
     * to their respective Discord types.
     * @param node The AST node containing the options map.
     * @throws {DisChordError} If the node is not a BDO or an option type is invalid.
     * @returns {string} A stringified array of Discord option objects.
     * @override
     */
    public visit (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se esperaba un BDO, se recibió '${node.type}'`,
            location: node.location
        }).format();

        const optionNames = Object.keys(node.blocks);
    
        const results = optionNames.map(OptionName => {
            const OptionNode = node.blocks[OptionName] as DisChordODBNode;
            const OptionType = DisChordTypeMap[this.getOptionType(OptionNode)];

            if (!OptionType) {
                throw new DisChordError({
                    phase: ErrorLevel.Compiler,
                    message: `Tipo de opción no reconocido en '${OptionName}'`,
                    location: OptionNode.location
                }).format();
            }

            switch (OptionType) {
                case DiscordOptionType.String:
                    return this.generateStringOption(OptionName, OptionNode);
                default:
                    return '';
            }
        });

        return results.join(', ');
    }

    /**
     * Generates the extraction code block based on option keys without mutating state.
     * @param {DisChordASTNode} node - The AST node containing the options map.
     * @returns {string} The formatted JS destructured constant code.
     */
    public generateVariables (node: DisChordASTNode): string {
        if (node.type != 'BDO') return '';
        
        const optionNames = Object.keys(node.blocks);
        if (optionNames.length === 0) return '';

        return `const { ${optionNames.join(', ')} } = contexto.options;`;
    }

    /**
     * Extracts and normalizes the option type from the ODB properties.
     * @private
     */
    private getOptionType (node: DisChordODBNode): string {
        const OptionType = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'opcion')
        );

        return (OptionType ?? '').replace(/"/g, '').toLowerCase();
    }

    /**
     * Generates the configuration object for a String-type Discord option.
     * @private
     */
    private generateStringOption (name: string, node: DisChordODBNode): string {
        const description = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'descripcion')
        );

        if (!description) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `En la declaración de la opción tipo 'String', se esperaba 'descripcion'.`,
            location: node.location
        }).format();

        const required = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'requerido')
        );

        if (!required) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `En la declaración de la opción tipo 'String', se esperaba 'requerido'.`,
            location: node.location
        }).format();

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