import { ASTNode } from "../../chord/types";
import { CollectorNode, CollectorPulseBody } from "../types";
import { DisChordGenerator } from "./generator";

/**
 * Generator class responsible for generating code related to component collectors and their event handling in DisChord.
 */
export default class CollectorGenerator {
    /**
     * @param ctx The context of the DisChordGenerator.
     */
    constructor (private ctx: DisChordGenerator) {}

    /**
     * Generates code for a CollectorNode, which represents a component collector in DisChord.
     * It creates a collector based on the specified variable and sets up event handling for the collector's pulses.
     * @param node The CollectorNode representing the component collector to generate code for, containing the variable and pulse bodies.
     * @returns The generated AST for component collector.
     */
    generate (node: CollectorNode): string {
        const body: string = node.body.map((PulseBody: CollectorPulseBody) => {
            const previousContext = this.ctx.currentInteraction;
            this.ctx.currentInteraction = 'interaccion';
            const PulseBodyStr: string = PulseBody.body.map((n: ASTNode): string => this.ctx.visit(n)).join('\n');
            this.ctx.currentInteraction = previousContext;

            return `
                collector.${PulseBody.method}(${this.ctx.visit(PulseBody.id)}, async (interaccion) => {
                    ${PulseBodyStr}
                })
            `;
        }).join('\n');

        return `
            let collector = ${this.ctx.visit(node.variable)}.createComponentCollector({
                filter: (i) => i.user.id === contexto.author.id,
                timeout: 60000
            });

            ${body}
        `;
    }
}