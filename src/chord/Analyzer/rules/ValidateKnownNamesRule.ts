import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, BaseNode, IdentificatorNode, ODBMode, ODBNode, SyntaxFunction, TokenType } from "../../model/types";
import { JsGlobals } from "../../corelib/JsGlobals";
import { EditDistance } from "../../../utils/EditDistance";

/**
 * Rejects a name that is used but declared nowhere: `mostrar nadie` or `"hola {nadie}"` would compile
 * and fail only when run. Every identifier that is a reference (read, callee, target of an assignment,
 * object of an access, value in a block, the message of a `recolector`) must be one of:
 *  1. a symbol of the table: a variable, parameter, function, class, import, or the name of a command or event;
 *  2. a JavaScript global of the curated list (`JsGlobals`);
 *  3. a syntax function (`rango`) or a class of the core library;
 *  4. a name the rule tracks itself while it walks, since they are not symbols: the variable of a `para`
 *     while its body lasts, and the keys of an intelligent block (`@BDOI`) while its body lasts;
 *  5. a function of the core library.
 * The message suggests a visible name close to the one written (`¿Querías decir 'nadie2'?`). A member
 * (`x.foo`) is not checked, and neither is using a name before declaring it.
 */
export class ValidateKnownNamesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * The names that each node being walked makes visible, innermost last (none for most nodes).
     */
    private readonly tracked: (readonly string[])[] = [];

    /**
     * The names of the syntax functions (`rango`), which the core library has no table of.
     */
    private readonly syntaxFunctions: ReadonlySet<string> = new Set(Object.values(SyntaxFunction));

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.tracked.length = 0;
        this.walkScoped(nodes, node => this.enter(node), () => this.exit());
    }

    private enter (node: ASTNode<T, N>): void {
        this.tracked.push(this.namesOf(node));

        if (node.type === TokenType.IDENTIFICADOR) this.validate(node as IdentificatorNode<T>);
    }

    private exit (): void {
        this.tracked.pop();
    }

    /**
     * The names a node makes visible to what it holds: the keys of an intelligent block.
     */
    private namesOf (node: ASTNode<T, N>): readonly string[] {
        return node.type === TokenType.BDO && (node as ODBNode<T, N>).mode === ODBMode.Intelligent ? Object.keys((node as ODBNode<T, N>).blocks) : [];
    }

    private isKnown (name: string, node: IdentificatorNode<T>): boolean {
        return this.context.symbolTable.lookup(name) !== undefined
            || JsGlobals.has(name)
            || this.syntaxFunctions.has(name)
            || this.context.coreLib.isClassName(name)
            || this.tracked.some(names => names.includes(name))
            || this.context.coreLib.resolveFunction(node, this.context.symbolTable) !== undefined;
    }

    /**
     * @throws {DisChordError} If the identifier names nothing visible.
     */
    private validate (node: IdentificatorNode<T>): void {
        if (this.isKnown(node.value, node)) return;

        const close = this.closestVisible(node.value);
        const message = `El nombre '${node.value}' no está declarado.${close ? ` ¿Querías decir '${close}'?` : ''}`;

        this.fail(message, node);
    }

    /**
     * @returns {string | undefined} The visible name nearest to `name`, if one is within two edits.
     */
    private closestVisible (name: string): string | undefined {
        const candidates = [ ...this.context.symbolTable.visibleNames(), ...this.tracked.flat() ];
        let best: string | undefined;
        let bestDistance = 3;

        for (const candidate of candidates) {
            const distance = EditDistance.between(name, candidate);

            if (distance < bestDistance) {
                best = candidate;
                bestDistance = distance;
            }
        }

        return best;
    }
}
