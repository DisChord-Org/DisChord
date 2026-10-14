import * as fs from 'fs';
import path from 'path';

/**
 * A file on disk. Holding one means the path was checked when it was built: it is absolute and,
 * at that moment, it existed and was a regular file (not a directory, not a missing path). Every
 * place that used to pass a path as a bare `string` and trust it can take a `File` instead and
 * stop re-deriving names, extensions and relative paths.
 *
 * The check is a snapshot, as it is in any language: the file can still vanish afterwards, and
 * `read()` reports that as the I/O error it is.
 *
 * A file can also carry its content in memory (`withContent`): what an editor holds for a buffer
 * that has unsaved changes, or that was never saved. There the guarantee is about the location —
 * the directory exists and nothing but a file can sit at that path — and `read()` answers the
 * content it carries instead of whatever the disk holds.
 *
 * @class File
 */
export class File {
    /** Absolute path, with the platform's separators. */
    public readonly absolutePath: string;

    /** Content held in memory in place of the disk's, when there is one. */
    private readonly content?: string;

    private constructor(absolutePath: string, content?: string) {
        this.absolutePath = absolutePath;
        this.content = content;
    }

    /**
     * Builds a `File` from a path, checking that it points to an existing regular file.
     *
     * @param {string} rawPath - Absolute path, or relative to the working directory.
     * @returns {File}
     * @throws {Error} If nothing exists at the path, or what exists is not a regular file.
     */
    public static of(rawPath: string): File {
        const absolutePath = path.resolve(rawPath);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`El archivo no existe: ${absolutePath}`);
        }

        if (!fs.statSync(absolutePath).isFile()) {
            throw new Error(`La ruta no es un archivo: ${absolutePath}`);
        }

        return new File(absolutePath);
    }

    /**
     * Builds a `File` whose content lives in memory, at a path that may not exist on disk yet.
     * If the path does exist, the in-memory content shadows what the disk holds.
     *
     * @param {string} rawPath - Absolute path, or relative to the working directory.
     * @param {string} content - The file's content.
     * @returns {File}
     * @throws {Error} If a directory sits at the path, or the directory it would live in is missing.
     */
    public static withContent(rawPath: string, content: string): File {
        const absolutePath = path.resolve(rawPath);

        if (fs.existsSync(absolutePath) && !fs.statSync(absolutePath).isFile()) {
            throw new Error(`La ruta no es un archivo: ${absolutePath}`);
        }

        const directory = path.dirname(absolutePath);

        if (!fs.existsSync(directory) || !fs.statSync(directory).isDirectory()) {
            throw new Error(`El directorio no existe: ${directory}`);
        }

        return new File(absolutePath, content);
    }

    /**
     * Writes UTF-8 text to a path, creating the file or replacing it.
     *
     * @param {string} rawPath - Absolute path, or relative to the working directory.
     * @param {string} content - The file's content.
     * @returns {File} The file written.
     * @throws {Error} If the directory it would live in is missing, or a directory sits at the path.
     */
    public static write(rawPath: string, content: string): File {
        const file = File.withContent(rawPath, content);

        fs.writeFileSync(file.absolutePath, content, 'utf-8');

        return File.of(file.absolutePath);
    }

    /**
     * Same as `of`, but answers `undefined` instead of throwing when the path is not an
     * existing regular file (it is missing, or it is a directory).
     *
     * @param {string} rawPath - Absolute path, or relative to the working directory.
     * @returns {File | undefined}
     */
    public static tryOf(rawPath: string): File | undefined {
        const absolutePath = path.resolve(rawPath);

        return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile() ? new File(absolutePath) : undefined;
    }

    /** File name with its extension, e.g. `index.chord`. */
    public get name(): string {
        return path.basename(this.absolutePath);
    }

    /** File name without its extension, e.g. `index`. */
    public get baseName(): string {
        return path.basename(this.absolutePath, this.extension);
    }

    /** Extension including the dot, e.g. `.chord`; empty when there is none. */
    public get extension(): string {
        return path.extname(this.absolutePath);
    }

    /** Absolute path of the directory that contains the file. */
    public get directory(): string {
        return path.dirname(this.absolutePath);
    }

    /**
     * Whether the file has the given extension.
     *
     * @param {string} extension - With the dot, e.g. `.chord`.
     */
    public hasExtension(extension: string): boolean {
        return this.extension === extension;
    }

    /**
     * Path of the file relative to a base directory, always with `/` separators so it reads the
     * same on every platform (messages, JSON, snapshots).
     *
     * @param {string} base - Directory to be relative to.
     */
    public relativeTo(base: string): string {
        return path.relative(base, this.absolutePath).split(path.sep).join('/');
    }

    /**
     * Reads the file as UTF-8 text, or answers the content it carries in memory.
     *
     * @returns {string}
     * @throws {Error} The underlying I/O error if the file can no longer be read.
     */
    public read(): string {
        return this.content ?? fs.readFileSync(this.absolutePath, 'utf-8');
    }

    public toString(): string {
        return this.absolutePath;
    }
}
