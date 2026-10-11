import { File } from '../utils/File';

/**
 * Represents a snapshot of a processed source file.
 */
interface CodeEntry {
    fileName: string;
    content: string;
    timestamp: number;
}

/**
 * Global Source Code State Manager.
 * * Centralizes access to the current source code and maintains a compilation history
 * to prevent "prop drilling" across the Lexer, Parser, and Compiler layers.
 */
export class CodeProvider {
    private _currentCode: string = "";
    private _currentFile?: File;

    /** Internal indexed storage for file history. */
    private history: Record<string, CodeEntry> = {};

    constructor() {}

    /**
     * Updates the current active code and archives it in the history record.
     * @param entry Object containing the file and the source content.
     */
    public set currentCode(entry: { file: File, content: string }) {
        this._currentCode = entry.content;
        this._currentFile = entry.file;

        this.history[entry.file.absolutePath] = {
            fileName: entry.file.absolutePath,
            content: entry.content,
            timestamp: Date.now()
        };
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

    /**
     * Retrieves the source content of a previously processed file from history.
     * @param fileName The unique name/path of the file to look up.
     * @returns The source string if found, otherwise undefined.
     */
    public getFromHistory(fileName: string): string | undefined {
        return this.history[fileName]?.content;
    }
}