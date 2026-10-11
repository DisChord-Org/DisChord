import { Directory } from '../../utils/Directory';
import { SymbolTable } from './SymbolsTable';
import { KeyWords } from '../KeywordsManager';
import { CodeProvider } from '../CodeProvider';
import { CoreLibUtils } from '../corelib/CoreLibUtils';
import { CoreLibDispatch } from '../corelib/CoreLibDispatch';

/**
 * Shared state context passed through compiler pipeline phases.
 *
 * @interface CompilationContext
 * @template T
 */
export interface CompilationContext<T extends string = string> {
    symbolTable: SymbolTable;
    keywordsManager: KeyWords<T>;
    codeProvider: CodeProvider;
    /** Root of the project being compiled. */
    projectRoot: Directory;
    /** Where every compiled file of the project goes; it may not exist yet. */
    distDir: string;
    /** Where the file being compiled is written: `distDir`, or what `--out-dir` says. */
    outputDir: string;
    extraFiles: Map<string, string>;
    /** Lookups over the core library of the dialect being compiled. */
    coreLib: CoreLibUtils<string>;
    /** How a call on a receiver of ambiguous type is emitted, over the same table as `coreLib`. */
    coreLibDispatch: CoreLibDispatch<string>;
}
