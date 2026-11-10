import { AnalysisRule } from "../AnalysisRule";
import { JsReservedWords } from "../../corelib/JsReservedWords";
import { ASTNode, BaseNode } from "../../model/types";
import { DeclaredName, DeclaredNames } from "../DeclaredNames";

/**
 * Rejects declaring a name JavaScript reserves (`class`, `await`, `eval`...), and one that belongs to a class of the core library (`Mapa`, `Mates`,
 * `consola`...): as a class, a variable, a free function, a parameter, an imported name or the
 * variable of a loop. A member of a class (a method or property) may carry such a name, and so may
 * a function named like a free function of the library (`esperar`), which wins over it.
 *
 * The names the compiler puts in scope itself (`cliente`, `canal`, see `CoreLibClass.injected`)
 * may be a parameter, since the callbacks it calls receive them, but not be declared otherwise.
 *
 * Runs first, so the error is this one and not a duplicate-declaration one.
 */
export class ValidateDeclarationNamesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walk(nodes, current => this.validate(current));
    }

    private validate (node: ASTNode<T, N>): void {
        DeclaredNames.of(node).forEach(declared => this.reject(declared, node));
    }

    /**
     * @param {DeclaredName} declared - A name being declared, with what it declares and whether it is a parameter, the one place an injected name is allowed.
     * @param {ASTNode<T, N>} node - The declaring node.
     * @throws {DisChordError} If the name is a reserved word of JavaScript or one of a class of the core library.
     * @private
     */
    private reject ({ name, description, isParameter }: DeclaredName, node: ASTNode<T, N>): void {
        if (JsReservedWords.has(name)) this.fail(`No se puede declarar ${description} '${name}': es una palabra reservada de JavaScript`, node);

        const coreLib = this.context.coreLib;
        if (!coreLib.isClassName(name)) return;

        if (coreLib.isInjectedName(name)) {
            if (isParameter) return;

            this.fail(`No se puede declarar ${description} '${name}': es un identificador reservado por DisChord`, node);
        }

        this.fail(`No se puede declarar ${description} '${name}': es el nombre de una clase de la biblioteca estándar`, node);
    }
}
