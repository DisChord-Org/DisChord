import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { TokenType } from "../../../chord/types";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { CollectorNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { CollectorSchema } from "../../Generator/constants/schemas";

/**
 * Validates a `recolector`'s own properties against {@link CollectorSchema} — the same schema
 * `CollectorVisitor` reads to generate the collector — plus `alPulsarId`, which doesn't fit
 * `BDOSchema`'s "named fields" model (its value is a BDO whose keys are arbitrary button ids, not
 * a fixed set of fields a schema could describe) and stays a one-off check. `CollectorSchema`
 * itself declares no `required`/`mapping` fields today, so this is currently a no-op for those —
 * wired up anyway so a future constraint on `filtro`/`tiempo`/`alFinalizar` is enforced for free,
 * the same way `ButtonSchema`'s `emoji` or `EmbedFieldSchema`'s `descripcion`/`lineado` already are
 * (added straight to schemas the Analyzer already validates). Moved out of `CollectorVisitor`,
 * which used to discover `alPulsarId`'s problem mid-generation — see `ValidateCallTargetsRule` for
 * the full rationale behind the split.
 */
export class ValidateCollectorRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type !== DisChordTokenType.CREAR_RECOLECTOR) return;

            const methods = (current as CollectorNode).methods;
            this.validator.validate(methods, CollectorSchema);

            const pulseIdNode = methods.blocks['alPulsarId'];
            if (pulseIdNode && pulseIdNode.type !== TokenType.BDO) this.fail(
                `Se esperaba un BDO con las ids y sus funciones asociadas después de 'alPulsarId'`,
                pulseIdNode.location
            );
        }));
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location }).format();
    }
}
