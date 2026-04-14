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
class CodeProvider {
    private _currentCode: string = "";
    private _currentFileName: string = "";

    /** Internal indexed storage for file history. */
    private history: Record<string, CodeEntry> = {};

    constructor() {}

    /**
     * Updates the current active code and archives it in the history record.
     * @param entry Object containing the filename and the source content.
     */
    public set currentCode(entry: { name: string, content: string }) {
        this._currentCode = entry.content;
        this._currentFileName = entry.name;

        this.history[entry.name] = {
            fileName: entry.name,
            content: entry.content,
            timestamp: Date.now()
        };
    }

    /** Returns the currently active source code for the compilation process. */
    public get currentCode(): string {
        return this._currentCode;
    }

    /** Returns the name of the file currently being processed. */
    public get currentFileName(): string {
        return this._currentFileName;
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

/**
 * Singleton instance of CodeProvider.
 * Use this to set or retrieve the source code across the DisChord engine.
 */
export const codeProvider = new CodeProvider();