import fs from "node:fs";
import path from "node:path";

import { Test } from "../../../Test";
import { Program } from "../../../../src/cli/Program";

interface Position { line: number; column: number }
interface EmittedToken { type: string; value: string; start: Position; end: Position; synthetic?: true }

/**
 * @class EmitInterpolationSpansTest
 * @description Validates the tokens of an interpolated text: every fragment of text and every token of an expression spans exactly what it was read from, without overlapping the next, and what the lexer invents (the parentheses, `mas` and the empty text that opens the whole) is marked `synthetic` and has no width.
 */
export class EmitInterpolationSpansTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Emit Interpolation Spans - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to give each token of an interpolated text its exact span, and mark the ones the lexer invents';

    /**
     * Not a comparison with a snapshot: it runs the CLI over the fixture and inspects what it prints.
     * @override
     */
    protected override async run (): Promise<void> {
        const input = path.join(this.fixturePath, 'input.chord');
        const source = fs.readFileSync(input, 'utf-8');
        const tokens = await this.emit(input);

        const lines = source.split('\n');
        const offsetOf = (position: Position): number => {
            let offset = 0;

            for (let line = 1; line < position.line; line++) offset += lines[line - 1].length + 1;

            return offset + position.column - 1;
        };

        let previousEnd = 0;

        tokens.forEach(token => {
            const start = offsetOf(token.start);
            const end = offsetOf(token.end);

            if (token.synthetic) {
                if (start !== end) throw new Error(`The synthetic ${token.type} '${token.value}' has width`);
            } else {
                const text = source.slice(start, end);

                if (text !== token.value) throw new Error(`Token ${token.type} ${JSON.stringify(token.value)} spans ${JSON.stringify(text)}`);
                if (start < previousEnd) throw new Error(`Token ${token.type} ${JSON.stringify(token.value)} overlaps the previous one`);

                previousEnd = end;
            }
        });

        const fragments = tokens.filter(token => token.type === 'TEXTO' && !token.synthetic).map(token => token.value);
        if (fragments.join('|').replace(/\r\n/g, '\n') !== 'hola |!\nlinea | fin') throw new Error(`The fragments of the text are ${JSON.stringify(fragments)}`);

        // `"{n}"` starts with an expression: the empty text that opens it is invented
        const invented = tokens.filter(token => token.type === 'TEXTO' && token.synthetic);
        if (invented.length !== 1 || invented[0].value !== '') throw new Error('The empty text that opens "{n}" should be the one synthetic text');

        // an expression sits between a synthetic `(` at its `{` and a synthetic `)` at its `}`
        const synthetic = tokens.filter(token => token.synthetic).map(token => token.value);
        if (synthetic.filter(value => value === '(').length !== synthetic.filter(value => value === ')').length) throw new Error('The synthetic parentheses do not pair');
    }

    private async emit (target: string): Promise<EmittedToken[]> {
        const printed: string[] = [];
        const original = console.log;
        const previousExitCode = process.exitCode;

        console.log = (...args: unknown[]) => { printed.push(args.join(' ')); };

        try {
            await new Program().parse(['node', 'dischord', target, '--emit', 'tokens']);
        } finally {
            console.log = original;
            process.exitCode = previousExitCode;
        }

        const document = JSON.parse(printed[0]);
        if (!document.ok) throw new Error(`--emit tokens failed: ${printed[0]}`);

        return document.tokens;
    }
}
