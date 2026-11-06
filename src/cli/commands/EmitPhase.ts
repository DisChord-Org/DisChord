import { EmitKind, GlobalCLIOptions } from '../Program';
import { CompilerConfig } from '../../utils/FileSystem';
import { BaseChordError } from '../../errors/ChordError';
import { File } from '../../utils/File';
import { Location } from '../../chord/model/types';
import { FileCompiler } from './FileCompiler';

/**
 * The phase `--emit` stops at: it runs only that phase over a file and describes what it produced.
 * Nothing is analyzed, generated or written.
 */
export class EmitPhase {
    /**
     * Version of the document `--emit` prints. Adding keys does not change it; renaming or
     * removing one, or changing what it means, does. The shape of the nodes of an `ast` is the
     * compiler's own and is not covered by it.
     */
    private static readonly SCHEMA = 1;

    /**
     * Runs only the phase `--emit` asks for over a file and describes what it produced.
     *
     * @param {File} file - The file to emit.
     * @param {EmitKind} kind - The phase to stop at.
     * @param {CompilerConfig} config - The layout of the project the file belongs to.
     * @param {GlobalCLIOptions} options - Parsed Commander options.
     * @returns {object} The keys the document gains.
     */
    public static run(file: File, kind: EmitKind, config: CompilerConfig, options: GlobalCLIOptions): object {
        const compiler = new FileCompiler(options);

        try {
            if (kind === 'tokens') {
                const tokens = compiler.tokenize(file, config, config.distDir).map(token => ({
                    type: token.type,
                    value: token.value,
                    start: token.location as Location,
                    end: token.end,
                    ...(token.synthetic ? { synthetic: true } : {}),
                    ...(token.blankLineBefore ? { blankLineBefore: true } : {})
                }));

                return { schema: EmitPhase.SCHEMA, emit: kind, file: file.absolutePath, tokens };
            }

            return {
                schema: EmitPhase.SCHEMA,
                emit: kind, file: file.absolutePath,
                ...compiler.parseTree(file, config, config.distDir)
            };
        } catch (error) {
            throw BaseChordError.attachFile(error, file);
        }
    }
}
