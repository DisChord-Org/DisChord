import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { TokenType } from "../../../chord/types";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, EmbedDeclarationNode, MessageNode } from "../../types";
import { EmbedSchema } from "../../Generator/constants/schemas";

/**
 * Validates every embed DisChord can reach at generation time against {@link EmbedSchema} — the
 * same schema `EmbedVisitor` reads to generate an embed: a named `embed <Nombre> { ... }`
 * declaration, and any inline BDO reached through an `enviar mensaje { embed ... }` property (a
 * single embed, or a list of them). Moved out of `EmbedVisitor`, which used to discover the same
 * problems mid-generation — see `ValidateCallTargetsRule` for the full rationale behind the split.
 * The `embed` property's own single-vs-list discovery has no schema equivalent — it's a shape
 * specific to how that property nests, not a single field's presence/vocabulary — but every embed
 * BDO it finds is validated the same way, against the one shared schema (whose `nested` entries
 * already cover `campos`/`pie`).
 */
export class ValidateEmbedsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.CREAR_EMBED) this.validator.validate((current as EmbedDeclarationNode).body, EmbedSchema);
            if (current.type === DisChordTokenType.CREAR_MENSAJE) this.validateEmbedProperty((current as MessageNode).object.blocks['embed']);
        }));
    }

    /**
     * A message's `embed` property can be a single embed, or a list of them. A reference to an
     * already-declared embed is left alone — it's validated once, at its own `CREAR_EMBED`
     * declaration site.
     * @private
     */
    private validateEmbedProperty (embed: DisChordASTNode | undefined): void {
        if (!embed) return;

        if (embed.type === TokenType.LISTA) {
            embed.body.forEach(item => {
                if (item.type === TokenType.BDO) this.validator.validate(item as DisChordODBNode, EmbedSchema);
            });
            return;
        }

        if (embed.type === TokenType.BDO) this.validator.validate(embed as DisChordODBNode, EmbedSchema);
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location }).format();
    }
}
