import path from 'path';

/**
 * Paths written the same way on every platform.
 */
export class PosixPath {
    /**
     * Rewrites a path with `/` separators so it reads the same on every platform (messages, JSON,
     * snapshots, import specifiers).
     *
     * @param {string} filePath - A path using the platform's separators.
     * @returns {string}
     */
    public static of(filePath: string): string {
        return filePath.split(path.sep).join('/');
    }
}
