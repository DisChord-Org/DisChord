import * as fs from 'fs';
import path from 'path';
import { File } from './File';

/**
 * A directory on disk. Like `File`, holding one means the path was checked when it was built: it
 * is absolute and, at that moment, it existed and was a directory. Output directories that may
 * not exist yet are created through `Directory.create`, so there is never a "directory" value
 * that points to nothing.
 *
 * @class Directory
 */
export class Directory {
    /** Absolute path, with the platform's separators. */
    public readonly absolutePath: string;

    private constructor(absolutePath: string) {
        this.absolutePath = absolutePath;
    }

    /**
     * Builds a `Directory` from a path, checking that it points to an existing directory.
     *
     * @param {string} rawPath - Absolute path, or relative to the working directory.
     * @returns {Directory}
     * @throws {Error} If nothing exists at the path, or what exists is not a directory.
     */
    public static of(rawPath: string): Directory {
        const absolutePath = path.resolve(rawPath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`El directorio no existe: ${absolutePath}`);
        }

        if (!fs.statSync(absolutePath).isDirectory()) {
            throw new Error(`La ruta no es un directorio: ${absolutePath}`);
        }

        return new Directory(absolutePath);
    }

    /**
     * Same as `of`, but answers `undefined` instead of throwing when the path is not an
     * existing directory (it is missing, or it is a file).
     *
     * @param {string} rawPath - Absolute path, or relative to the working directory.
     * @returns {Directory | undefined}
     */
    public static tryOf(rawPath: string): Directory | undefined {
        const absolutePath = path.resolve(rawPath);

        return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory() ? new Directory(absolutePath) : undefined;
    }

    /**
     * Returns the directory at the path, creating it (and any missing parent) first if needed.
     *
     * @param {string} rawPath - Absolute path, or relative to the working directory.
     * @returns {Directory}
     * @throws {Error} If something that is not a directory exists at the path.
     */
    public static create(rawPath: string): Directory {
        const absolutePath = path.resolve(rawPath);

        if (!fs.existsSync(absolutePath)) fs.mkdirSync(absolutePath, { recursive: true });

        return Directory.of(absolutePath);
    }

    /** Directory name, e.g. `src`. */
    public get name(): string {
        return path.basename(this.absolutePath);
    }

    /** The directory that contains this one (the root is its own parent). */
    public get parent(): Directory {
        return Directory.of(path.dirname(this.absolutePath));
    }

    /**
     * Joins segments onto the directory's path. The result is only a path: nothing guarantees it
     * exists, which is what makes it the way to name something about to be written.
     *
     * @param {...string} segments - Path segments, relative to this directory.
     * @returns {string}
     */
    public resolve(...segments: string[]): string {
        return path.join(this.absolutePath, ...segments);
    }

    /**
     * Whether a regular file with that name lives directly in the directory.
     *
     * @param {string} name - File name.
     */
    public hasFile(name: string): boolean {
        const candidate = this.resolve(name);

        return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
    }

    /**
     * A file that lives directly in the directory.
     *
     * @param {string} name - File name.
     * @returns {File}
     * @throws {Error} If there is no such file.
     */
    public file(name: string): File {
        return File.of(this.resolve(name));
    }

    /**
     * Every regular file under the directory, at any depth. Walks the tree by hand instead of
     * using `readdirSync`'s `recursive` option, which is only honoured from Node 20.1 onward and
     * is silently ignored on older runtimes, which would quietly turn this into a shallow scan.
     *
     * @param {string} [extension] - Only files with this extension, with the dot (e.g. `.chord`).
     * @returns {File[]}
     */
    public files(extension?: string): File[] {
        return fs.readdirSync(this.absolutePath, { withFileTypes: true }).flatMap(entry => {
            const entryPath = this.resolve(entry.name);

            if (entry.isDirectory()) return Directory.of(entryPath).files(extension);
            if (entry.isFile() && (extension === undefined || entry.name.endsWith(extension))) return [File.of(entryPath)];

            return [];
        });
    }

    /**
     * Deletes every file with the given extension under the directory that isn't in `keep`, then
     * removes the subdirectories that leaves empty (the directory itself stays).
     *
     * @param {string} extension - Extension with the dot, e.g. `.js`; other files are never touched.
     * @param {Set<string>} keep - Absolute paths of the files to leave in place.
     * @returns {string[]} Absolute paths of the files that were removed.
     */
    public removeFilesExcept(extension: string, keep: Set<string>): string[] {
        const removed: string[] = [];

        const walk = (dir: string): void => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const entryPath = path.join(dir, entry.name);

                if (entry.isDirectory()) walk(entryPath);
                else if (entry.name.endsWith(extension) && !keep.has(entryPath)) {
                    fs.rmSync(entryPath);
                    removed.push(entryPath);
                }
            }

            if (dir !== this.absolutePath && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
        };

        walk(this.absolutePath);

        return removed;
    }

    public toString(): string {
        return this.absolutePath;
    }
}
