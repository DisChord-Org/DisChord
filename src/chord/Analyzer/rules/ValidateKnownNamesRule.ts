import { AnalysisRule } from "../AnalysisRule";
import { ASTNode, BaseNode, CompilerMetadataKind, IdentificatorNode, ODBMode, ODBNode, SymbolKind, SyntaxFunction, TokenType } from "../../model/types";
import { JsGlobals } from "../../corelib/JsGlobals";
import { Suggestion } from "../../../utils/Suggestion";

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
 *
 * A member of the class being declared (a property or a method, its own or inherited) is not a name by
 * itself: `valor` in a method would reach the JavaScript as a variable that does not exist, so it is
 * rejected with the way to write it (`esta.valor`, or `Clase.valor` for a `@fijar` one).
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
        this.rejectBareMember(node);

        if (this.isKnown(node.value, node)) return;

        const message = `El nombre '${node.value}' no está declarado.${Suggestion.didYouMean(node.value, this.visibleCandidates())}`;

        this.fail(message, node);
    }

    /**
     * @throws {DisChordError} If the name is that of a member of the class the identifier is in, with nothing declared closer taking the name.
     */
    private rejectBareMember (node: IdentificatorNode<T>): void {
        const table = this.context.symbolTable;
        const className = table.getMetadata<string>(CompilerMetadataKind.CurrentClass);
        const member = className === undefined ? undefined : table.classes.findMember(className, node.value);

        // anything else of that name, declared closer or outside the class, is what the name is in the JavaScript
        if (className === undefined || member === undefined || table.lookupAll(node.value).some(symbol => symbol !== member)) return;

        const what = member.kind === SymbolKind.Property ? 'una propiedad' : 'un método';
        const owner = member.metadata.isStatic ? className : 'esta';

        this.fail(`'${node.value}' es ${what} de la clase '${className}', no un nombre suelto: escribe '${owner}.${node.value}'`, node);
    }

    /**
     * @returns {string[]} The names the identifier could have been meant for: the visible ones.
     */
    private visibleCandidates (): string[] {
        return [ ...this.context.symbolTable.visibleNames(), ...this.tracked.flat() ];
    }
}
