import { Test } from "../../../Test";

/**
 * @class SimpleBDOParserTest
 * @description Validates that the parser correctly extracts a single Block Data Object (BDO) variable mapping.
 */
export class SimpleBDOParserTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Simple BDO - Parser Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to detect the block as a simple BDO';

    /**
     * @type {string}
     */
    public readonly code: string = `
        var armario es {
            peso 26.83
            precio 100
            color "marron"
        }
    `;

    /**
     * @type {string} Snapshot strictly mapped to match the actual lexer coordinates produced by the indented template string.
     */
    public readonly expected: string = JSON.stringify([
        {
            type: "Variable",
            id: "armario",
            value: {
                type: "BDO",
                mode: 0,
                blocks: {
                    peso: { type: "Literal", value: 26.83, raw: "26.83", location: { line: 3, column: 18 } },
                    precio: { type: "Literal", value: 100, raw: "100", location: { line: 4, column: 20 } },
                    color: { type: "Literal", value: "marron", raw: "marron", location: { line: 5, column: 19 } }
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