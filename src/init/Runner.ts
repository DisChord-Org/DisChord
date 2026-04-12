import { pathToFileURL } from 'url';

/**
 * Static utility class for executing compiled JavaScript modules.
 */
export class Runner {
    /**
     * Dynamically imports and runs a JavaScript module within the project context.
     * * @param filePath - The absolute path to the .mjs file to be executed.
     * @param projectRoot - The root directory of the project to set as the working directory.
     * @returns A promise that resolves to the imported module's exports.
     */
    static async execute(filePath: string, projectRoot: string): Promise<any> {
        process.chdir(projectRoot);
        const url = `${pathToFileURL(filePath).href}?u=${Date.now()}`;

        return await import(url);
    }
}