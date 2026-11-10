import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { DeclaredNames } from "../../../chord/Analyzer/DeclaredNames";
import { SharedModuleImporter } from "../../../chord/Analyzer/SharedModuleImporter";
import { ExportNode, ImportNode, TokenType } from "../../../chord/model/types";
import { GeneratedNames } from "../../Generator/constants/GeneratedNames";
import { CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";

/**
 * Rejects a declaration of the user's that takes a name the generated code declares or imports: it
 * would be a second declaration of the same name in the file, a SyntaxError once it runs. Two kinds
 * of name, each held to its own scope:
 *
 *  - The fixed names of the kind of file (see {@link GeneratedNames}): what a command, an event or
 *    `encender bot` imports from Seyfert, the class of a command and its `options`. Only a
 *    declaration at the top level of the file clashes; inside the body of a command or a function
 *    the same word is a local name, valid JavaScript.
 *  - The helpers the analyzer inserted because the file uses them (`createMessage`, `banMember`,
 *    `chordIterable`...), read from the synthetic imports themselves, so a name is held back only if the
 *    file really imports it. Declared in any scope, it would stand in for the helper where the
 *    generated code calls it.
 *
 * Runs last, once every rule that inserts an import has.
 */
export class ValidateGeneratedNamesRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        const helpers = this.helperNames(nodes);
        const fixed = this.fixedNames(nodes);
        const topLevel = this.topLevelNodes(nodes);

        this.walk(nodes, node => DeclaredNames.of(node).forEach(({ name, isFileLevel }) => {
            const clashes = helpers.has(name) || (fixed.has(name) && isFileLevel && topLevel.has(node));

            if (clashes) this.fail(`El nombre '${name}' lo usa DisChord en el código generado de este archivo: renómbralo.`, node);
        }));
    }

    /**
     * @returns {Set<string>} The names the inserted imports bring in.
     * @private
     */
    private helperNames (nodes: DisChordASTNode[]): Set<string> {
        return new Set(nodes
            .filter(node => node.type === TokenType.Importar && SharedModuleImporter.isSynthetic(node))
            .flatMap(node => (node as ImportNode<DisChordNodeType>).identificators));
    }

    /**
     * @returns {Set<DisChordASTNode>} The statements of the top level, and what an `exportar` there exports.
     * @private
     */
    private topLevelNodes (nodes: DisChordASTNode[]): Set<DisChordASTNode> {
        const exported = nodes
            .filter(node => node.type === TokenType.Exportar)
            .map(node => (node as ExportNode<DisChordNodeType, DisChordNode>).object);

        return new Set<DisChordASTNode>([ ...nodes, ...exported ]);
    }

    /**
     * @returns {Set<string>} What the file declares at the top level by the kind of file it is: a command, an event or `encender bot`.
     * @private
     */
    private fixedNames (nodes: DisChordASTNode[]): Set<string> {
        const names = new Set<string>();

        nodes.forEach(node => {
            if (node.type === DisChordTokenType.CREAR_COMANDO) {
                const command = node as CommandNode;

                GeneratedNames.SeyfertImports.command.forEach(name => names.add(name));
                names.add(GeneratedNames.commandClassName(command.value));
                if (this.hasOptions(command)) names.add(GeneratedNames.OptionsConstantName);
            }

            if (node.type === DisChordTokenType.EVENTO) GeneratedNames.SeyfertImports.event.forEach(name => names.add(name));

            if (node.type === DisChordTokenType.ENCENDER_BOT) {
                GeneratedNames.SeyfertImports.client.forEach(name => names.add(name));
                names.add(GeneratedNames.ClientConstantName);
            }
        });

        return names;
    }

    private hasOptions (command: CommandNode): boolean {
        const options = command.body.blocks['opciones'];

        return options?.type === TokenType.BDO;
    }
}
