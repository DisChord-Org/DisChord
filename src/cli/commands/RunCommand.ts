import path from 'path';
import { pathToFileURL } from 'url';
import { DisChordError, ErrorLevel } from '../../errors/ChordError';

/**
 * Options accepted by the RunCommand handler.
 * 
 * @interface RunCommandOptions
 */
export interface RunCommandOptions {
    /** Root directory of the project to set as working directory */
    projectRoot?: string;
}

/**
 * Command handler responsible for dynamically importing and executing compiled JavaScript modules.
 * 
 * @class RunCommand
 */
export class RunCommand {
    /**
     * Dynamically imports and executes a compiled JavaScript file (.mjs).
     * 
     * @param {string} targetPath - Relative or absolute path to the target .mjs file.
     * @param {RunCommandOptions} [options={}] - Execution options including the working directory context.
     * @returns {Promise<unknown>} Resolves with the imported module exports.
     * @throws {DisChordError} Wrapped execution error if module import or execution fails.
     */
    public async execute(targetPath: string, options: RunCommandOptions = {}): Promise<unknown> {
        const absoluteTarget = path.resolve(targetPath);
        const projectRoot = options.projectRoot || path.dirname(absoluteTarget);

        console.log(`Ejecutando: ${path.relative(projectRoot, absoluteTarget)}\n`);

        try {
            process.chdir(projectRoot);
            const url = `${pathToFileURL(absoluteTarget).href}?u=${Date.now()}`;

            return await import(url);
        } catch (error) {
            throw new DisChordError({
                phase: ErrorLevel.Execution,
                message: error instanceof Error ? error.message : String(error),
                location: error instanceof Error && error.stack ? { line: 0, column: 0 } : undefined
            });
        }
    }
}