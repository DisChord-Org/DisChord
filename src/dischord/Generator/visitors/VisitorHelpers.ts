import { BDOResolver } from "../../../chord/Generator/BDOResolver";
import { Generator } from "../../../chord/Generator/Generator";
import { DisChordASTNode, DisChordNode, DisChordNodeType } from "../../types";

/**
 * What the DisChord visitors share when they translate a node: resolving a BDO against a schema and
 * rendering the statements of a body.
 */
export class VisitorHelpers {
    /**
     * A `BDOResolver` bound to how `generator` visits an expression: the one every DisChord visitor
     * that resolves a BDO against a schema builds.
     * @param generator - The generator whose `visit` renders the BDO's expressions.
     * @returns {BDOResolver<DisChordNodeType, DisChordNode>} The resolver.
     */
    public static resolverFor (generator: Generator<DisChordNodeType, DisChordNode>): BDOResolver<DisChordNodeType, DisChordNode> {
        return new BDOResolver<DisChordNodeType, DisChordNode>(expression => generator.visit(expression));
    }

    /**
     * Renders the statements of a command or event body, one per line, indented and terminated by `;`.
     * @param generator - The generator that visits each statement.
     * @param nodes - The statements of the body.
     * @returns {string} The statements joined with newlines.
     */
    public static renderStatements (generator: Generator<DisChordNodeType, DisChordNode>, nodes: DisChordASTNode[]): string {
        return nodes.map(node => "    " + generator.visit(node) + ";").join('\n');
    }
}
