import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { TokenType } from "../../../chord/types";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { ButtonDeclarationNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, MessageNode } from "../../types";
import { ButtonSchema } from "../../Generator/constants/schemas";

/**
 * Validates every button DisChord can reach at generation time against {@link ButtonSchema} — the
 * same schema `ButtonVisitor` reads to generate a button: a named `boton <Nombre> { ... }`
 * declaration, and any inline BDO reached through an `enviar mensaje { boton ... }` property (a
 * single button, a flat list auto-split into rows of up to 5, or a list of lists laying out
 * explicit rows — mirroring `ActionRowVisitor`'s own discovery of those shapes). Moved out of
 * `ButtonVisitor`/`ActionRowVisitor`, which used to discover the same problems mid-generation — see
 * `ValidateCallTargetsRule` for the full rationale behind the split. The row-layout discovery
 * itself has no schema equivalent — it's a shape specific to how `boton` values nest, not a single
 * field's presence/vocabulary — but every button BDO it finds is validated the same way, against
 * the one shared schema.
 */
export class ValidateButtonsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /** Discord's maximum number of components (buttons) allowed in a single ActionRow. */
    private static readonly MAX_PER_ROW = 5;

    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.CREAR_BOTON) this.validator.validate((current as ButtonDeclarationNode).body, ButtonSchema);
            if (current.type === DisChordTokenType.CREAR_MENSAJE) this.validateButtonProperty((current as MessageNode).object.blocks['boton']);
        }));
    }

    /**
     * A message's `boton` property can be a single button, a flat list, or a list of lists. A
     * reference to an already-declared button is left alone — it's validated once, at its own
     * `CREAR_BOTON` declaration site.
     * @private
     */
    private validateButtonProperty (button: DisChordASTNode | undefined): void {
        if (!button) return;

        if (button.type !== TokenType.LISTA) {
            this.validateButtonElement(button);
            return;
        }

        const isManualLayout = button.body.length > 0 && button.body.every(item => item.type === TokenType.LISTA);

        if (!isManualLayout) {
            button.body.forEach(item => this.validateButtonElement(item));
            return;
        }

        button.body.forEach(row => {
            if (row.type !== TokenType.LISTA) return;

            if (row.body.length > ValidateButtonsRule.MAX_PER_ROW) this.fail(
                `Una fila de botones admite como máximo ${ValidateButtonsRule.MAX_PER_ROW}, se han especificado ${row.body.length}.`,
                row.body[0].location
            );

            row.body.forEach(item => this.validateButtonElement(item));
        });
    }

    /**
     * Validates one button-producing element: an inline BDO gets checked against
     * {@link ButtonSchema}; anything else is a reference to an already-declared button, validated
     * at its own site.
     * @private
     */
    private validateButtonElement (element: DisChordASTNode): void {
        if (element.type === TokenType.BDO) this.validator.validate(element as DisChordODBNode, ButtonSchema);
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location }).format();
    }
}
