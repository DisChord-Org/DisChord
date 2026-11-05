import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { Test } from "../../../Test";

/**
 * @class FileLengthTest
 * @description Keeps the files of `src` short: a warning from 300 lines and a failure from 400, with no exceptions.
 */
export class FileLengthTest extends Test {
    /** From this many lines on a file is reported, without failing. */
    private static readonly WARNING_LINES = 300;

    /** From this many lines on a file fails the test. There are no exceptions: split the file. */
    private static readonly ERROR_LINES = 400;

    /**
     * @type {string}
     */
    public readonly name: string = 'File Length - Test';

    /**
     * @type {string}
     */
    public readonly description: string = `It has to warn of a source file over ${FileLengthTest.WARNING_LINES} lines and reject one over ${FileLengthTest.ERROR_LINES}`;

    /**
     * @override
     */
    protected override async run (): Promise<void> {
        const root = process.cwd();
        const lengths = new Map<string, number>();

        for (const file of FileLengthTest.sourceFiles(join(root, 'src'))) {
            lengths.set(relative(root, file).split('\\').join('/'), readFileSync(file, 'utf-8').split(/\r?\n/).length);
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
