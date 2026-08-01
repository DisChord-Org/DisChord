import { Test } from "../../../Test";

/**
 * @class BDOIAndCodeParserTest
 * @description Validates that the parser correctly extracts a single BDOI IIFF with code definition.
 */
export class BDOIAndCodeParserTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Intelligent BDO & Code Definition - Parser Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to detect the block as a Intelligent BDO with code definition';

    /**
     * @type {string}
     */
    public readonly code: string = `
        var panas es {
            Ether "está chetado";
            JustEvil "goat";
            ZendrYz "wen pibe";

            consola.imprimir(JustEvil) // "goat"
            JustEvil es "la cabra"
        }

        consola.imprimir(panas)
    `;

    /**
     * @type {string} Snapshot strictly mapped to match the actual lexer coordinates produced by the indented template string.
     */
    public readonly expected: string = JSON.stringify([
        {
            type: 'Variable',
            id: 'panas',
            value: {
                type: 'BDO',
                mode: 1,
                blocks: {
                    Ether: { type: 'Literal', value: 'está chetado', raw: 'está chetado', location: { line: 3, column: 19 } },
                    JustEvil: { type: 'Literal', value: 'goat', raw: 'goat', location: { line: 4, column: 22 } },
                    ZendrYz: { type: 'Literal', value: 'wen pibe', raw: 'wen pibe', location: { line: 5, column: 21 } }
                },
                body: [
                    {
                        type: 'Llamada',
                        object: {
                            type: 'Acceso',
                            object: { type: 'IDENTIFICADOR', value: 'consola', location: { line: 7, column: 13 } },
                            property: 'imprimir',
                            location: { line: 7, column: 21 }
                        },
                        params: [ { type: 'IDENTIFICADOR', value: 'JustEvil', location: { line: 7, column: 30 } } ],
                        location: { line: 7, column: 38 }
                    },
                    {
                        type: 'Asignacion',
                        left: { type: 'IDENTIFICADOR', value: 'JustEvil', location: { line: 8, column: 13 } },
                        assignment: { type: 'Literal', value: 'la cabra', raw: 'la cabra', location: { line: 8, column: 25 } },
                        location: { line: 8, column: 25 }
                    }
                ],
                location: { line: 9, column: 9 }
            },
            location: { line: 9, column: 9 }
        },
        {
            type: 'Llamada',
            object: {
                type: 'Acceso',
                object: { type: 'IDENTIFICADOR', value: 'consola', location: { line: 11, column: 9 } },
                property: 'imprimir',
                location: { line: 11, column: 17 }
            },
            params: [ { type: 'IDENTIFICADOR', value: 'panas', location: { line: 11, column: 26 } } ],
            location: { line: 11, column: 31 }
        }
    ], null, 2);

    /**
     * @method run
     * @returns {void}
     * @public
     * @override
     */
    public run(): void {
        const context = this.createMockContext(this.code);
        const lexed = this.lex(context);
        const ast = this.parse(lexed, context);

        this.assertDeepEqual(JSON.stringify(ast, null, 2), this.expected);
    }
}