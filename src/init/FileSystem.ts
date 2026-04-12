import fs from 'fs';
import path from 'path';

/**
 * Global configuration contract for the compiler's environment.
 */
export interface CompilerConfig {
    inputPath: string;      // The entry path
    projectRoot: string;    // The project root (where the dist directory is located)
    distDir: string;        // Output path for the .mjs files
    isDirectory: boolean;   // Are we compiling an entire project or a single script?
}

/**
 * Static utility class for filesystem operations and path resolution.
 */
export class FileSystem {
    /**
     * Initializes the compiler configuration by analyzing the input path.
     * * @param rawInput - The raw string path received from the CLI.
     * @returns A validated CompilerConfig object with normalized absolute paths.
     * @throws Will throw an error if the path does not exist.
     */
    static configure(rawInput: string): CompilerConfig {
        const inputPath = path.resolve(rawInput);
        const isDirectory = fs.statSync(inputPath).isDirectory();
        
        const baseDir = isDirectory ? inputPath : path.dirname(inputPath);
        const projectRoot = path.basename(baseDir) === 'src' ? path.join(baseDir, '..') : baseDir;

        return {
            inputPath,
            projectRoot,
            distDir: path.join(projectRoot, 'dist'),
            isDirectory
        };
    }

    /**
     * Recursively retrieves all .chord files from a directory or returns the single file path.
     * * @param dir - The starting directory or file path.
     * @param isDirectory - Boolean flag to determine search mode.
     * @returns An array of absolute paths to all discovered .chord files.
     */
    static getChordFiles(dir: string, isDirectory: boolean): string[] {
        if (!isDirectory) return [dir];
        return fs.readdirSync(dir, { recursive: true })
            .filter(file => typeof file === 'string' && file.endsWith('.chord'))
            .map(file => path.resolve(dir, file as string));
    }

    /**
     * Determines the root of the project based on the location of the source files.
     * * @param inputPath - The current working path.
     * @param isDirectory - Boolean flag of the input type.
     * @returns The absolute path to the project's root directory.
     */
    static resolveProjectRoot(inputPath: string, isDirectory: boolean): string {
        const dir = isDirectory ? inputPath : path.dirname(inputPath);
        return path.basename(dir) === 'src' ? path.join(dir, '..') : dir;
    }
}