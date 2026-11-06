import { File } from '../utils/File';

/**
 * Global Source Code State Manager.
 * * Centralizes access to the current source code to prevent "prop drilling"
 * across the Lexer, Parser, and Compiler layers.
 */
export class CodeProvider {
    private _currentCode: string = "";
    private _currentFile?: File;

    /**
     * Updates the current active code and the file it belongs to.
     * @param entry Object containing the file and the source content.
     */
    public set currentCode(entry: { file: File, content: string }) {
        this._currentCode = entry.content;
        this._currentFile = entry.file;
    }

    /** Returns the currently active source code for the compilation process. */
    public get currentCode(): string {
        return this._currentCode;
    }

    /** Returns the file currently being processed. */
    public get currentFile(): File {
        if (!this._currentFile) throw new Error('No hay ningún archivo en proceso');

        return this._currentFile;
    }
}
