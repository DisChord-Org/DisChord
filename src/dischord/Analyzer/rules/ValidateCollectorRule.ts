import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { TokenType } from "../../../chord/types";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { CollectorNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";

/**
 * Validates that a `recolector`'s `alPulsarId` property, if present, is a BDO mapping ids to
 * callbacks. Moved out of `CollectorVisitor`, which used to discover the same problem
 * mid-generation — see `ValidateCallTargetsRule` for the full rationale behind the split.
 *
 * Doesn't go through `BDOSchema`/`BDOValidator` like `ValidateCommandRule`/`ValidateButtonsRule`/
 * `ValidateEmbedsRule` do: `alPulsarId`'s value is a BDO whose keys are arbitrary button ids, not
 * a fixed set of named fields a schema could describe — there's nothing to validate beyond "is
 * this a BDO at all", which is a one-off check, not a shape worth its own schema.
 */
export class ValidateCollectorRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type !== DisChordTokenType.CREAR_RECOLECTOR) return;

            const pulseIdNode = (current as CollectorNode).methods.blocks['alPulsarId'];
            if (pulseIdNode && pulseIdNode.type !== TokenType.BDO) throw new DisChordError({
                phase: ErrorLevel.Analysis,
                message: `Se esperaba un BDO con las ids y sus funciones asociadas después de 'alPulsarId'`,
                location: pulseIdNode.location
            }).format();
        }));
    }
}
