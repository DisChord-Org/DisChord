import path from "node:path";

import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { SeyfertLocations } from "../../tables/mappings";
import { FileSystem } from "../../../utils/FileSystem";
import { PosixPath } from "../../../utils/PosixPath";

/**
 * Validates that a `comando` or an `evento` is declared in the folder Seyfert loads it from. Each
 * file compiles to the same place under `dist/` it has under `src/`, and the generated
 * `seyfert.config.mjs` only points Seyfert at `dist/comandos` and `dist/eventos`: declared anywhere
 * else in `src/`, the command or the event would compile and never be loaded.
 *
 * Only a file under the `src/` of its project is checked. A script outside of it is not laid out
 * as a project, and where its output lands is not this rule's to judge.
 */
export class ValidateHandlerFolderRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * The folder of `src/` each declaration has to live in (at any depth), and how to name it to the user.
     * @private
     * @readonly
     */
    private static readonly Folders: Partial<Record<DisChordNodeType, { folder: string; noun: string }>> = {
        [DisChordTokenType.CREAR_COMANDO]: { folder: SeyfertLocations.commands, noun: 'comando' },
        [DisChordTokenType.EVENTO]: { folder: SeyfertLocations.events, noun: 'evento' }
    };

    /**
     * @override
     * @throws {DisChordError} If the file declares a command or an event outside of its folder.
     */
    check (nodes: DisChordASTNode[]): void {
        const relative = this.pathInSources();

        if (relative === undefined) return;

        // a file directly in `src/` is in no folder
        const folder = relative.includes('/') ? relative.split('/')[0] : undefined;

        nodes.forEach(node => {
            const expected = ValidateHandlerFolderRule.Folders[node.type];

            if (!expected || folder === expected.folder) return;

            const target = `${FileSystem.SOURCE_DIR}/${expected.folder}/`;

            this.fail(`Un ${expected.noun} va en '${target}': este archivo está en '${FileSystem.SOURCE_DIR}/${relative}' y el bot no lo cargaría. Muévelo a '${target}${path.posix.basename(relative)}'.`, node);
        });
    }

    /**
     * Where the file being compiled sits inside the `src/` of its project.
     * @returns {string | undefined} Its path from `src/`, with `/` separators, or `undefined` if it is not under `src/`.
     * @private
     */
    private pathInSources (): string | undefined {
        const sources = this.context.projectRoot.resolve(FileSystem.SOURCE_DIR);
        const relative = path.relative(sources, this.context.codeProvider.currentFile.absolutePath);

        if (relative === '' || relative.startsWith('..') || path.isAbsolute(relative)) return undefined;

        return PosixPath.of(relative);
    }
}
