import { CompilationContext } from "../chord/model/CompilationContext";
import { SymbolTable } from "../chord/model/SymbolsTable";
import { KeyWords } from "../chord/KeywordsManager";
import { CodeProvider } from "../chord/CodeProvider";
import { Directory } from "../utils/Directory";
import { DisChordNodeType } from "../dischord/types";
import { disChordCoreLibUtils, disChordCoreLibDispatch } from "../dischord/corelib";

/**
 * Builds the `CompilationContext` of a DisChord compilation: empty tables over the dialect's core
 * library. The one place that does it, for the compiler and for the tests that run its phases by hand.
 * The grammar is not registered here, nor is any code loaded: each caller does that.
 * @class DisChordCompilationContext
 */
export class DisChordCompilationContext {
    /**
     * @param {{ projectRoot: Directory; distDir: string }} layout - Where the project is and where it compiles to.
     * @param {string} [outputDir] - Directory the file being compiled is written to; `layout.distDir` by default.
     * @returns {CompilationContext<DisChordNodeType>} A fresh context.
     */
    public static create (layout: { projectRoot: Directory; distDir: string }, outputDir: string = layout.distDir): CompilationContext<DisChordNodeType> {
        return {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot: layout.projectRoot,
            distDir: layout.distDir,
            outputDir,
            extraFiles: new Map(),
            extraDirectories: new Set(),
            coreLib: disChordCoreLibUtils,
            coreLibDispatch: disChordCoreLibDispatch
        };
    }
}
