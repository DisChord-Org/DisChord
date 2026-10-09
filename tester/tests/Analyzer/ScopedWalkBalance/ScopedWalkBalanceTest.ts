import { Test } from "../../../Test";
import { AnalysisRule } from "../../../../src/chord/Analyzer/AnalysisRule";
import { SymbolTable } from "../../../../src/chord/model/SymbolsTable";
import { ASTNode, BaseNode, Location, TokenType } from "../../../../src/chord/types";
import { CompilationContext } from "../../../../src/cli/commands/CompileCommand";

type Mode = 'none' | 'visit' | 'exit';

const marker = 'marcador';
const here: Location = { line: 0, column: 0 };

/**
 * A rule that walks a class → function → function tree with `walkScoped`, registering a symbol in
 * every scope it enters and failing, as told, from the `visit` or `exit` hook of the innermost function.
 */
class ProbeRule extends AnalysisRule<string, BaseNode<string>> {
    constructor (context: CompilationContext<string>, private readonly failIn: Mode) {
        super(context);
    }

    check (nodes: ASTNode<string, BaseNode<string>>[]): void {
        this.walkScoped(
            nodes,
            node => {
                this.context.symbolTable.register(marker, {}, here);
                if (this.failIn === 'visit' && this.isInnermost(node)) throw new Error('probe failure');
            },
            node => {
                if (this.failIn === 'exit' && this.isInnermost(node)) throw new Error('probe failure');
            }
        );
    }

    private isInnermost (node: ASTNode<string, BaseNode<string>>): boolean {
        return (node as unknown as { id?: string }).id === 'interna';
    }
}

/**
 * @class ScopedWalkBalanceTest
 * @description Validates that `AnalysisRule.walkScoped` leaves the symbol table's scope stack as it found it: after a walk that completes, and after one that fails from its `visit` or `exit` hook three scopes deep. Checked by behavior: a symbol registered inside the walk is no longer visible, and the same name can be registered again in the scope the walk started from.
 */
export class ScopedWalkBalanceTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Scoped Walk Balance - Test';

    /**
     * @type {string}
     */
    public readonly description: string = "It has to leave the scope stack balanced after a scoped walk, with or without a failure inside it";

    /**
     * Not a compilation: it runs a probe rule over a hand-built tree.
     * @override
     */
    protected override async run (): Promise<void> {
        this.assertBalanced('none');
        this.assertBalanced('visit');
        this.assertBalanced('exit');
    }

    private assertBalanced (failIn: Mode): void {
        const symbolTable = new SymbolTable();
        symbolTable.registerScopeOwner(TokenType.Clase);
        symbolTable.registerScopeOwner(TokenType.Funcion);

        const context = { symbolTable } as unknown as CompilationContext<string>;
        const tree = [
            {
                type: TokenType.Clase, id: 'externa', location: here, body: [
                    { type: TokenType.Funcion, id: 'media', location: here, body: [
                        { type: TokenType.Funcion, id: 'interna', location: here, body: [] }
                    ] }
                ]
            }
        ] as unknown as ASTNode<string, BaseNode<string>>[];

        let failed = false;

        try {
            new ProbeRule(context, failIn).check(tree);
        } catch {
            failed = true;
        }

        if (failed !== (failIn !== 'none')) {
            throw new Error(`[${failIn}] the walk ${failed ? 'failed' : 'did not fail'} when it should ${failed ? 'not ' : ''}have`);
        }

        if (symbolTable.lookup(marker) !== undefined) {
            throw new Error(`[${failIn}] a symbol registered inside the walk is still visible: a scope was left open`);
        }

        try {
            symbolTable.register(marker, {}, here);
        } catch {
            throw new Error(`[${failIn}] the name registered inside the walk is a duplicate in the starting scope: a scope was left open`);
        }
    }
}
