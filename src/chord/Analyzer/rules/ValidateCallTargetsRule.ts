import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, CallNode, TokenType } from "../../types";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Validates that every call expression (`x(...)`) targets something callable — an identifier, a
 * property access, or `super` — rejecting the rest (e.g. `(1 mas 2)()`) as invalid at analysis
 * time instead of letting `CallVisitor` discover the same problem mid-generation. Mirrors how
 * TypeScript's own checker rejects an uncallable expression before the emitter ever runs: semantic
 * validation belongs in the Analyzer, with the Generator free to assume it already holds.
 */
export class ValidateCallTargetsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.validate(current)));
    }

    /**
     * Rejects a `CallNode` whose `object` isn't one of the shapes `CallVisitor` knows how to
     * translate: a property access, a plain identifier, or `super`.
     * @param {ASTNode<T, N>} node - The node under inspection; only `CallNode`s are checked.
     * @throws {ChordError} If `node` is a `CallNode` whose `object` isn't callable.
     * @private
     */
    private validate (node: ASTNode<T, N>): void {
        if (node.type !== TokenType.LLAMADA) return;

        const callNode = node as CallNode<T, N>;
        const isCallableTarget = callNode.object.type === TokenType.ACCESO
            || callNode.object.type === TokenType.IDENTIFICADOR
            || callNode.object.type === TokenType.Super;

        if (isCallableTarget) return;

        throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: "Se esperaba un identificador o un acceso de propiedad válido para ejecutar la llamada.",
            location: callNode.location
        }).format();
    }
}
