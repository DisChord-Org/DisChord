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
 * @class File
 */
export class File {
    /** Absolute path, with the platform's separators. */
    public readonly absolutePath: string;

    private constructor(absolutePath: string) {
        this.absolutePath = absolutePath;
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
     * Reads the file as UTF-8 text.
     *
     * @returns {string}
     * @throws {Error} The underlying I/O error if the file can no longer be read.
     */
    public read(): string {
        return fs.readFileSync(this.absolutePath, 'utf-8');
    }

    public toString(): string {
        return this.absolutePath;
    }
}
