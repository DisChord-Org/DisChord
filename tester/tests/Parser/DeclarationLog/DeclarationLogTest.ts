import { Test } from "../../../Test";
import { DeclarationLog } from "../../../../src/chord/model/DeclarationLog";
import { Token, TokenType } from "../../../../src/chord/types";

/**
 * @class DeclarationLogTest
 * @description Validates the log of declared names: that it keeps source order and positions, that a name belongs to the innermost open container, and that a container is closed even when what ran inside it failed.
 */
export class DeclarationLogTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Declaration Log - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to record names in order, each with what it belongs to";

    /**
     * Not a comparison with a snapshot: it exercises the class directly.
     * @override
     */
    protected override async run (): Promise<void> {
        const log = new DeclarationLog<string>();

        const returned = log.record('variable', this.identifier('a', 1, 5));
        if (returned !== 'a') throw new Error('record should answer the name');

        log.within('Caja', () => {
            log.record('method', this.identifier('area', 3, 9));

            log.within('area', () => {
                log.record('parameter', this.identifier('factor', 3, 14));
            });

            log.record('property', this.identifier('ancho', 4, 10));
        });

        log.record('function', this.identifier('libre', 8, 9));

        const summary = log.entries().map(entry => `${entry.kind}:${entry.container ?? ''}:${entry.name}`).join();
        if (summary !== 'variable::a,method:Caja:area,parameter:area:factor,property:Caja:ancho,function::libre') {
            throw new Error(`The log holds ${summary}`);
        }

        const parameter = log.entries().find(entry => entry.name === 'factor')!;
        if (parameter.start.line !== 3 || parameter.start.column !== 14 || parameter.end.column !== 20) throw new Error('A name lost its range');

        // A failure inside a container must not leave it open for the names that come after
        try {
            log.within('Rota', () => { throw new Error('boom'); });
        } catch { /* expected */ }

        log.record('variable', this.identifier('despues', 9, 1));
        const after = log.entries().find(entry => entry.name === 'despues')!;
        if (after.container !== undefined) throw new Error(`A closed container leaked: ${after.container}`);

        // What is read out is a copy: it cannot be used to change the log
        const copy = log.entries() as unknown as unknown[];
        copy.length = 0;
        if (log.entries().length !== 6) throw new Error('entries() exposes the log itself');
    }

    /**
     * An identifier token that starts at `column` and is `value.length` wide.
     */
    private identifier (value: string, line: number, column: number): Token<string> {
        return {
            type: TokenType.IDENTIFICADOR,
            value,
            location: { line, column },
            end: { line, column: column + value.length }
        };
    }
}
