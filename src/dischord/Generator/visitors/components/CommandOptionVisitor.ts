import { DisChordError, ErrorLevel } from "../../../../ChordError";
import { DisChordTypeMap } from "../../../core.lib";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, DiscordOptionType } from "../../../types";
import { DisChordGenerator } from "../../Generator";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";

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
     * Internal cache of option identifiers found during the last generation cycle.
     * Used to build the destructuring statement in getExtractionCode().
     */
    private lastGeneratedOptions: string[] = [];

    /**
     * @param parent The context of the CommandGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    /**
     * Generates a JavaScript destructuring statement for the command's internal logic.
     * @example Returns "const { myOption } = ctx.options;"
     * @returns A string containing the variable extraction code.
     */
    public getExtractionCode(): string {
        if (this.lastGeneratedOptions.length === 0) return '';
        
        return `const { ${this.lastGeneratedOptions.join(', ')} } = ctx.options;`;
    }

    /**
     * Entry point for the CommandGenerator. Checks if the 'opciones' block exists 
     * within the provided ODB and initiates generation.
     * @param node The Object Definition Block (BDO) of the command.
     * @returns The 'options' constant declaration string.
     */
    visitIfNodeExists (node: DisChordODBNode): string {
        const options = this.parent.get(BDOVisitor).getODBProperty(node, 'opciones');

        return options? `const options = [${this.visit(options)}];` : '';
    }

    /**
     * Iterates through the options defined in the DisChord source and maps them 
     * to their respective Discord types.
     * @param node The AST node containing the options map.
     * @throws {DisChordError} If the node is not a BDO or an option type is invalid.
     * @returns A stringified array of Discord option objects.
     */
    visit (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se esperaba un BDO, se recibió '${node.type}'`,
            location: node.location
        }).format();

        const optionNames = Object.keys(node.blocks);
        this.lastGeneratedOptions = optionNames;
    
        const results = optionNames.map(OptionName => {
            const OptionNode = node.blocks[OptionName] as DisChordODBNode;
            const OptionType = DisChordTypeMap[this.getOptionType(OptionNode)];

            if (!OptionType) {
                throw new DisChordError({
                    phase: ErrorLevel.Compiler,
                    message: `Tipo de opción '${Option}' no reconocido en '${OptionName}'`,
                    location: OptionNode.location
                }).format();
            }

            // Currently, only string options are supported. This can be expanded in the future to support more types.
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
     * @param name The identifier of the option.
     * @param node The ODB node containing option properties.
     * @throws {DisChordError} If mandatory properties are missing.
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