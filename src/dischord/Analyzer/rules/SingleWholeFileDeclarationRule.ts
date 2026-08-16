import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Validates that at most one whole-file declaration (`comando`, `evento`) exists per file. Since
 * the generator emits each one's entire returned string as the file's content (compiled 1:1 from
 * its source `.chord` file by `CompileCommand`), a *second* one would produce a broken module
 * (duplicate `export default`, duplicate imports of the same name). Other top-level code
 * (imports, reusable classes/embeds, etc.) alongside a single whole-file declaration is fine —
 * ES modules don't require `import`/`export` to be textually first, so nothing about the
 * generated output actually breaks by mixing them.
 */
export class SingleWholeFileDeclarationRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * Node types whose generator produces a whole, standalone module (a command or event file),
     * instead of contributing inline code to whatever file declares them. See `CommandVisitor`
     * and `EventVisitor` in the generator: each returns the *entire* content of its target file.
     * @private
     * @readonly
     */
    private static readonly WholeFileDeclarationTypes: DisChordNodeType[] = [
        DisChordTokenType.CREAR_COMANDO,
        DisChordTokenType.EVENTO
    ];

    /**
     * @override
     * @throws {DisChordError} If more than one whole-file declaration exists in the same file.
     */
    check (nodes: DisChordASTNode[]): void {
        const wholeFileNodes = nodes.filter(node => SingleWholeFileDeclarationRule.WholeFileDeclarationTypes.includes(node.type));

        if (wholeFileNodes.length > 1) throw new DisChordError({
            phase: ErrorLevel.Analysis,
            message: `Solo se permite un 'comando' o 'evento' por archivo. Este archivo declara ${wholeFileNodes.length}: separalos en un archivo por cada uno.`,
            location: wholeFileNodes[1].location
        }).format();
    }
}
