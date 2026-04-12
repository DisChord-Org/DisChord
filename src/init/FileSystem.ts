import fs from 'fs';
import path from 'path';

export interface CompilerConfig {
    inputPath: string;      // The entry path
    projectRoot: string;    // The project root (where the dist directory is located)
    distDir: string;        // Output path for the .mjs files
    isDirectory: boolean;   // Are we compiling an entire project or a single script?
}

export class FileSystem {
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

    static getChordFiles(dir: string, isDirectory: boolean): string[] {
        if (!isDirectory) return [dir];
        return fs.readdirSync(dir, { recursive: true })
            .filter(file => typeof file === 'string' && file.endsWith('.chord'))
            .map(file => path.resolve(dir, file as string));
    }

    static resolveProjectRoot(inputPath: string, isDirectory: boolean): string {
        const dir = isDirectory ? inputPath : path.dirname(inputPath);
        return path.basename(dir) === 'src' ? path.join(dir, '..') : dir;
    }
}