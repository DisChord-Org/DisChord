import { Test } from "../../../Test";

/**
 * @class BDOIParserTest
 * @description Validates that the parser correctly extracts a IIFF variable.
 */
export class BDOIParserTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Intelligent BDO - Parser Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to detect the block as a Intelligent BDO';

    /**
     * @type {string}
     */
    public readonly code: string = `
        @BDOI
        var chainsawman es {
            makima "narcisista";
            denji ("mascota de una " + makima);
        }
    `;

    /**
     * @type {string} Snapshot strictly mapped to match the actual lexer coordinates produced by the indented template string.
     */
    public readonly expected: string = JSON.stringify([
        {
            type: 'Variable',
            id: 'chainsawman',
            value: {
                type: 'BDO',
                mode: 1,
                blocks: {
                    makima: { type: 'Literal', value: 'narcisista', raw: 'narcisista', location: { line: 4, column: 20 } },
                    denji: {
                        type: 'Expresion',
                        object: {
                            type: 'ExpresionBinaria',
                            left: { type: 'Literal', value: 'mascota de una ', raw: 'mascota de una ', location: { line: 5, column: 20 } },
                            operator: 'mas',
                            right: { type: 'IDENTIFICADOR', value: 'makima', location: { line: 5, column: 40 } },
                            location: { line: 5, column: 40 }
                        },
                        location: { line: 5, column: 46 }
                    }
                },
                body: [],
                location: { line: 6, column: 9 }
            },
            location: { line: 6, column: 9 }
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