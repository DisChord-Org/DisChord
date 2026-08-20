import { DisChordError, ErrorLevel } from "../../../../errors/ChordError";
import { CollectorNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from "./../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";

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

        const filterCallback = this.parent.visitIfExists(bdo.getODBProperty(node.methods, 'filtro'));
        const filter = filterCallback
            ? `(interaccion) => ${filterCallback}(interaccion, cliente, contexto)`
            : '(interaccion) => interaccion.user.id === contexto.author.id';

        const idle = this.parent.visitIfExists(bdo.getODBProperty(node.methods, 'tiempo')) || '60000';

        const onStopCallback = this.parent.visitIfExists(bdo.getODBProperty(node.methods, 'alFinalizar'));
        const onStop = onStopCallback
            ? `(razon, reiniciar) => ${onStopCallback}(razon, reiniciar, cliente, contexto)`
            : undefined;

        const body = this.visitPulseIdMethod(bdo.getODBProperty(node.methods, 'alPulsarId'));

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
     * Maps each button id to a call to its referenced callback function.
     * @private
     * @param node The AST node containing id keys and callback-reference values.
     * @throws {DisChordError} If the node is not a valid BDO.
     * @returns Concatenated event listener code for all IDs in the block.
     */
    private visitPulseIdMethod (node: DisChordASTNode | undefined): string {
        if (!node) return '';

        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se esperaba un BDO con las ids y sus funciones asociadas después de 'alPulsarId'`,
            location: node.location
        }).format();

        const pulseCodes: string[] = Object.entries(node.blocks).map(([identificator, callbackNode]) => {
            const callback = this.parent.visit(callbackNode as DisChordASTNode);

            return `collector.run(${JSON.stringify(identificator)}, (interaccion) => ${callback}(interaccion, cliente, contexto));`;
        });

        return pulseCodes.join('\n');
    }
}
