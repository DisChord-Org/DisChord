import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { BDOValidator } from "../../../chord/Analyzer/BDOValidator";
import { Symbol, TokenType } from "../../../chord/model/types";
import { isIdentificatorNode, isVariableNode } from "../../../chord/ast.guards";
import { DisChordError, ErrorLevel } from "../../../errors/ChordError";
import { CollectorNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType, MessageNode } from "../../types";
import { ButtonIdIndex } from "../ButtonIdIndex";
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
 *
 * It also checks that each id in `alPulsarId` is the id of a button of the message the collector is
 * attached to (`recolector m`, with `m` a `var m es enviar mensaje {...}` of the same body), but only when
 * every button of that message is visible; a message that comes from elsewhere is not checked.
 */
export class ValidateCollectorRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly validator = new BDOValidator<DisChordNodeType, DisChordNode>((message, location) => this.fail(message, location));

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        // built when the first collector with `alPulsarId` shows up, once the whole file is known: a button
        // may be declared after it
        let buttons: ButtonIdIndex | undefined;

        // the message each `var m es enviar mensaje {...}` holds, by the symbol of `m`: a variable of the same
        // name in another scope is another symbol, so it is never taken for it
        const messages: Map<Symbol, MessageNode> = new Map();

        this.walkScoped(nodes, current => {
            if (isVariableNode(current) && current.value.type === DisChordTokenType.CREAR_MENSAJE) {
                const symbol = this.context.symbolTable.lookup(current.id);
                if (symbol) messages.set(symbol, current.value);
            }

            if (current.type !== DisChordTokenType.CREAR_RECOLECTOR) return;

            const collector = current as CollectorNode;
            const methods = collector.methods;
            this.validator.validate(methods, CollectorSchema);

            const pulseIdNode = methods.blocks['alPulsarId'];
            if (pulseIdNode && pulseIdNode.type !== TokenType.BDO) this.fail(
                `Se esperaba un BDO con las ids y sus funciones asociadas después de 'alPulsarId'`,
                pulseIdNode.location
            );

            if (pulseIdNode && isIdentificatorNode(collector.variable)) {
                const name = collector.variable.value;
                const symbol = this.context.symbolTable.lookup(name);
                const message = symbol ? messages.get(symbol) : undefined;

                if (message) this.validatePulseIds(name, message, pulseIdNode as DisChordODBNode, buttons ??= new ButtonIdIndex(nodes));
            }
        });
    }

    /**
     * Each key of `alPulsarId` is the id of a button of the message the collector listens to. When every
     * button of that message can be seen and none has the id, the handler can never run (a typo; or the
     * button's id has braces, which gives it a value only at run time, while the key is fixed text).
     * @param {string} name - The message variable.
     * @param {MessageNode} message - The message it holds.
     * @param {DisChordODBNode} pulseIds - The `alPulsarId` block.
     * @param {ButtonIdIndex} buttons - The buttons of the file.
     * @private
     */
    private validatePulseIds (name: string, message: MessageNode, pulseIds: DisChordODBNode, buttons: ButtonIdIndex): void {
        const ids = buttons.idsOf(message);
        if (!ids) return;

        const quote = (id: string): string => `'${id}'`;
        const available = ids.fixed.join(', ') || 'ninguno';
        const fixed = ids.fixed.length > 0 ? `ids fijos (${ids.fixed.map(quote).join(', ')}) y ` : '';
        const dynamic = ids.dynamic.length === 1 ? 'uno dinámico' : `${ids.dynamic.length} dinámicos`;
        const dynamicTexts = ids.dynamic.map(id => quote(id.text)).join(', ');

        Object.entries(pulseIds.blocks).forEach(([ key, handler ]) => {
            if (ids.fixed.includes(key)) return;

            this.fail(
                ids.dynamic.length === 0
                    ? `alPulsarId espera un botón con id '${key}' en el mensaje '${name}'. Ids disponibles: ${available}.`
                    : `alPulsarId espera un botón con id '${key}', pero el mensaje '${name}' solo tiene ${fixed}${dynamic} (${dynamicTexts}); alPulsarId no puede enlazar ids dinámicos.`,
                handler.location
            );
        });
    }

    /**
     * @throws {DisChordError} Always.
     * @private
     */
    private fail (message: string, location: DisChordASTNode['location']): never {
        throw new DisChordError({ phase: ErrorLevel.Analysis, message, location });
    }
}
