import { CollectorNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { SubGenerator } from "./../../../../chord/Generator/SubGenerator";
import { BDOResolver } from "../../../../chord/Generator/BDOResolver";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";
import { CollectorSchema } from "../../constants/schemas";

/** Config for the Collector Generator param. */
interface CollectorConfig {
    variable: string;
    filter: string;
    idle: string;
    onStop: string | undefined;
}

/**
 * Generator class responsible for generating code related to component collectors and their event handling in DisChord.
 *
 * Every behavioral property here (`filtro`, `alFinalizar`, and each id inside `alPulsarId`) is a
 * *reference* to a `funcion` declared elsewhere — never inline code. That mirrors how any other
 * BDO property takes a value (`memear bruh`), so a collector reads as plain data binding named
 * callbacks, not as a block of code disguised as a property.
 *
 * Unlike the old inline body, a referenced callback is compiled as a standalone function and
 * can't close over the command's `run(contexto)` preamble — so it loses `contexto`, `cliente`,
 * `usuario`, etc. for free. `cliente` specifically also backs `imprimir` (`corelib.imprimir ===
 * 'cliente.logger.info'`), a plain compile-time text substitution that assumes a variable
 * literally named `cliente` is in scope wherever it's used — same requirement `eventsMap` already
 * satisfies for event handlers by injecting a fixed `cliente` parameter. Every callback here is
 * called with `(..., cliente, contexto)` trailing its own arguments for that reason; extra call
 * arguments a callback doesn't declare are simply ignored, same as anywhere else in JS.
 */
export default class CollectorVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.CREAR_RECOLECTOR;

    /**
     * Generates the initialization and event orchestration for a component collector.
     * @param node The CollectorNode containing the target variable and the interaction methods ODB.
     * @returns The generated JavaScript for the collector lifecycle.
     */
    visit (node: CollectorNode): string {
        const variable = this.parent.visit(node.variable);
        const bdo = this.parent.get(BDOVisitor);

        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));
        const properties = resolver.resolve(node.methods, CollectorSchema);

        const filter = properties['filtro']
            ? `(interaccion) => ${properties['filtro']}(interaccion, cliente, contexto)`
            : '(interaccion) => interaccion.user.id === contexto.author.id';

        const idle = properties['tiempo'];

        const onStop = properties['alFinalizar']
            ? `(razon, reiniciar) => ${properties['alFinalizar']}(razon, reiniciar, cliente, contexto)`
            : undefined;

        // 'alPulsarId', when present, is already guaranteed to be a BDO by the Analyzer's
        const body = this.visitPulseIdMethod(bdo.getODBProperty(node.methods, 'alPulsarId') as DisChordODBNode | undefined);

        return this.generateCollector({ variable, filter, idle, onStop }, body);
    }

    /**
     * Generates the base collector initialization with a default author filter and 60s idle timeout.
     * @private
     * @param config The resolved collector configuration (variable, filter, idle, onStop).
     * @param body The generated event listener methods.
     */
    private generateCollector (config: CollectorConfig, body: string): string {
        const onStopProperty = config.onStop ? `,\n                onStop: ${config.onStop}` : '';

        return `
            let collector = ${config.variable}.createComponentCollector({
                filter: ${config.filter},
                idle: ${config.idle}${onStopProperty}
            });

            ${body}
        `;
    }

    /**
     * Traverses the nested BDO within 'alPulsarId'.
     * Maps each button id to a call to its referenced callback function. That the 'alPulsarId'
     * value is a BDO (rather than some other expression), when present, is already guaranteed by
     * the Analyzer's `ValidateCollectorRule` — the caller casts it there, once, instead of this
     * method accepting a broader `DisChordASTNode` and re-asserting the shape internally.
     * @private
     * @param node The BDO mapping button ids to their callback-reference values.
     * @returns Concatenated event listener code for all IDs in the block.
     */
    private visitPulseIdMethod (node: DisChordODBNode | undefined): string {
        if (!node) return '';

        const pulseCodes: string[] = Object.entries(node.blocks).map(([identificator, callbackNode]) => {
            const callback = this.parent.visit(callbackNode);

            return `collector.run(${JSON.stringify(identificator)}, (interaccion) => ${callback}(interaccion, cliente, contexto));`;
        });

        return pulseCodes.join('\n');
    }
}
