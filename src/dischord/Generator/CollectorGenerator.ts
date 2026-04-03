import { CollectorNode, CollectorPulseBody, DisChordASTNode } from "../types";
import { DisChordGenerator } from "./generator";
import { SubGenerator } from "./subgenerator";

/**
 * Generator class responsible for generating code related to component collectors and their event handling in DisChord.
 */
export default class CollectorGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "CrearRecolector";

    /**
     * @param parent The context of the DisChordGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    /**
     * Generates code for a CollectorNode, which represents a component collector in DisChord.
     * It creates a collector based on the specified variable and sets up event handling for the collector's pulses.
     * @param node The CollectorNode representing the component collector to generate code for, containing the variable and pulse bodies.
     * @returns The generated code for component collector.
     */
    generate (node: CollectorNode): string {
        const body: string = node.body.map((PulseBody: CollectorPulseBody) => {
            const previousContext = this.parent.currentInteraction;
            this.parent.currentInteraction = 'interaccion';
            const PulseBodyStr: string = PulseBody.body.map((n: DisChordASTNode): string => this.visit(n)).join('\n');
            this.parent.currentInteraction = previousContext;

            return `
                collector.${PulseBody.method}(${this.visit(PulseBody.id)}, async (interaccion) => {
                    ${PulseBodyStr}
                })
            `;
        }).join('\n');

        return `
            let collector = ${this.visit(node.variable)}.createComponentCollector({
                filter: (i) => i.user.id === contexto.author.id,
                timeout: 60000
            });

            ${body}
        `;
    }
}