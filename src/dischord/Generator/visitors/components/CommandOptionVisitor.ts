import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { BDOResolver } from "../../../../chord/Generator/BDOResolver";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";
import { OptionSchema } from "../../constants/schemas";

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
     * Iterates through the options defined in the DisChord source and resolves each one against
     * its own `OptionSchema` (the same schema the Analyzer's `ValidateCommandRule` already
     * validated every entry against) — `node` is only ever reached here already confirmed to be a
     * BDO by `visitIfNodeExists`.
     * @param node The AST node containing the options map.
     * @returns {string} A stringified array of Discord option objects.
     * @override
     */
    public visit (node: DisChordASTNode): string {
        const optionsNode = node as DisChordODBNode;
        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));

        const results = Object.entries(optionsNode.blocks).map(([ optionName, optionNode ]) => {
            const resolved = resolver.resolve(optionNode as DisChordODBNode, OptionSchema(optionName, optionNode as DisChordODBNode));

            return `
                {
                    name: "${optionName}",
                    description: ${resolved['descripcion']},
                    required: ${resolved['requerido']},
                    type: ${resolved['opcion']}
                }
            `;
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
}
