import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { fieldKeys } from "../../../chord/BDOSchema";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { ChannelActionNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { ChannelActionSchemas } from "../../Generator/constants/schemas";

/**
 * Validates every `crear canal`, `editar canal` and `borrar canal` block against the schema of its
 * action — the same one `ChannelActionVisitor` resolves it with. Besides the presence and
 * vocabulary checks every schema gets, a property the action does not take is an error instead of
 * being silently dropped (`razon` in a `crear canal`, `servidor` in an `editar canal`...): the
 * block would otherwise look like it did something it does not.
 */
export class ValidateChannelActionsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.ACCION_CANAL) this.validate(current as ChannelActionNode);
        }));
    }

    /**
     * @private
     */
    private validate (node: ChannelActionNode): void {
        const schema = ChannelActionSchemas[node.action];
        const known = schema.fields.flatMap(field => fieldKeys(field.key));

        Object.entries(node.object.blocks).forEach(([ key, value ]) => {
            if (!known.includes(key)) this.fail(
                `'${node.action} canal' no admite '${key}'. Se admite: ${known.join(' / ')}.`,
                value.location
            );
        });

        this.validator.validate(node.object, schema);
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location });
    }
}
