import type { Directory } from '../utils/Directory';
import { SymbolTable } from '../chord/model/SymbolsTable';
import { KeyWords } from '../chord/KeywordsManager';
import { CodeProvider } from '../chord/CodeProvider';
import { TypeInferrer } from '../chord/Analyzer/TypeInferrer';
import type { CompilationContext } from '../chord/model/CompilationContext';
import type { DisChordNodeType } from '../dischord/types';
import { disChordCoreLibUtils, disChordCoreLibDispatch } from '../dischord/corelib';

type DisChordContext = CompilationContext<DisChordNodeType>;

/**
 * The DisChord compilation context: empty tables over the DisChord core library.
 * The one place that builds it, for the compiler and for the tests that run its phases by hand.
 * The grammar is not registered here, nor is any code loaded: each caller does that.
 *
 * @class DisChordCompilationContext
 */
export class DisChordCompilationContext {
    /**
     * Builds a context over the DisChord core library.
     *
     * @param {{ projectRoot: Directory; distDir: string }} layout - Where the project is and where it compiles to.
     * @param {string} [outputDir] - Directory the file being compiled is written to; `layout.distDir` by default.
     * @returns {DisChordContext}
     */
    public static create (
        layout: { projectRoot: Directory; distDir: string },
        outputDir: string = layout.distDir
    ): DisChordContext {
        let inferrer: DisChordContext['inferrer'] | undefined;

        const context: DisChordContext = {
            symbolTable: new SymbolTable(),
            keywordsManager: new KeyWords(),
            codeProvider: new CodeProvider(),
            projectRoot: layout.projectRoot,
            distDir: layout.distDir,
            outputDir,
            extraFiles: new Map(),
            extraDirectories: new Set(),
            coreLib: disChordCoreLibUtils,
            coreLibDispatch: disChordCoreLibDispatch,
            get inferrer () {
                return inferrer ??= new TypeInferrer(context);
            }
        };

        return context;
    }
}
