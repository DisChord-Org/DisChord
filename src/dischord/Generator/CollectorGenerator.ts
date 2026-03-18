import { ASTNode } from "../../chord/types";
import { CollectorNode, CollectorPulseBody } from "../types";
import { DisChordGenerator } from "./generator";

export default class CollectorGenerator {
    constructor (private ctx: DisChordGenerator) {}

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