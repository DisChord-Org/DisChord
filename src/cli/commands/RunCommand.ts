import { pathToFileURL } from 'url';
import { DisChordError, ErrorLevel } from '../../errors/ChordError';
import { ErrorMessage } from '../../errors/ErrorMessage';
import { File } from '../../utils/File';
import { Directory } from '../../utils/Directory';

/**
 * Options accepted by the RunCommand handler.
 * 
 * @interface RunCommandOptions
 */
interface RunCommandOptions {
    /** Root directory of the project to set as working directory */
    projectRoot?: Directory;
}

/**
 * Command handler responsible for dynamically importing and executing compiled JavaScript modules.
 * 
 * @class RunCommand
 */
export class RunCommand {
    /**
     * Dynamically imports and executes a compiled JavaScript file (.js).
     *
     * @param {string} targetPath - Relative or absolute path to the target .js file.
     * @param {RunCommandOptions} [options={}] - Execution options including the working directory context.
     * @returns {Promise<unknown>} Resolves with the imported module exports.
     * @throws {DisChordError} Wrapped execution error if module import or execution fails.
     */
    public async execute(targetPath: string, options: RunCommandOptions = {}): Promise<unknown> {
        try {
            const target = File.of(targetPath);
            const projectRoot = options.projectRoot ?? Directory.of(target.directory);

            console.log(`Ejecutando: ${target.relativeTo(projectRoot.absolutePath)}\n`);

            process.chdir(projectRoot.absolutePath);
            const url = `${pathToFileURL(target.absolutePath).href}?u=${Date.now()}`;

            return await import(url);
        } catch (error) {
            throw new DisChordError({
                phase: ErrorLevel.Execution,
                message: ErrorMessage.of(error),
                location: error instanceof Error && error.stack ? { line: 0, column: 0 } : undefined
            });
        }
    }
}