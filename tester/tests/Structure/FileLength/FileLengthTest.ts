import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { Test } from "../../../Test";

/**
 * @class FileLengthTest
 * @description Keeps the files of `src` short: a warning from 300 lines and a failure from 400. The only exception is the class
 * schemas of the core library (`corelib/classes`): they are tables of data, one class per file, and splitting a class by line
 * count would only scatter its methods.
 */
export class FileLengthTest extends Test {
    /** From this many lines on a file is reported, without failing. */
    private static readonly WARNING_LINES = 300;

    /** From this many lines on a file fails the test, unless it is one of the {@link EXEMPT_DIRECTORY} class schemas. */
    private static readonly ERROR_LINES = 400;

    /** The class schemas of the core library, in `src/chord` and in `src/dischord`: data tables that are not split by length. */
    private static readonly EXEMPT_DIRECTORY = '/corelib/classes/';

    /**
     * @type {string}
     */
    public readonly name: string = 'File Length - Test';

    /**
     * @type {string}
     */
    public readonly description: string = `It has to warn of a source file over ${FileLengthTest.WARNING_LINES} lines and reject one over ${FileLengthTest.ERROR_LINES}, except the core library class schemas`;

    /**
     * @override
     */
    protected override async run (): Promise<void> {
        const root = process.cwd();
        const lengths = new Map<string, number>();

        for (const file of FileLengthTest.sourceFiles(join(root, 'src'))) {
            const path = relative(root, file).split('\\').join('/');

            if (path.includes(FileLengthTest.EXEMPT_DIRECTORY)) continue;

            lengths.set(path, readFileSync(file, 'utf-8').split(/\r?\n/).length);
        }

        const problems: string[] = [];

        for (const [ file, lines ] of lengths) {
            if (lines > FileLengthTest.ERROR_LINES) problems.push(`${file} has ${lines} lines; the limit is ${FileLengthTest.ERROR_LINES}. Split it by responsibility.`);
            else if (lines > FileLengthTest.WARNING_LINES) console.warn(`[WARNING] ${file} has ${lines} lines (from ${FileLengthTest.WARNING_LINES} it should be justified or split).`);
        }

        if (problems.length > 0) throw new Error(problems.join('\n'));
    }

    /**
     * @param {string} directory - A directory to walk.
     * @returns {string[]} Every `.ts` file under it that is not a declaration file.
     */
    private static sourceFiles (directory: string): string[] {
        return readdirSync(directory).flatMap(name => {
            const path = join(directory, name);

            if (statSync(path).isDirectory()) return FileLengthTest.sourceFiles(path);

            return name.endsWith('.ts') && !name.endsWith('.d.ts') ? [ path ] : [];
        });
    }
}
