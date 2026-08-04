import { Test } from "../../../Test";

/**
 * @class BDOLoopParserTest
 * @description Validates that the parser correctly extracts an array loop.
 */
export class BDOLoopParserTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'BDO Loop - Parser Test';
    
    /**
     * @type {string}
     */
    public readonly description: string = 'It has to generate the loop AST correctly';

    /**
     * @type {string}
     */
    public readonly code: string = `
        var a es {
            "uno": 1,
            "dos": 2,
            "tres": 3
        }

        para (item en a) {
            consola.imprimir(item)
        }
    `;

    /**
     * @type {string} Snapshot strictly mapped to match the actual lexer coordinates produced by the indented template string.
     */
    public readonly expected: string = JSON.stringify([
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