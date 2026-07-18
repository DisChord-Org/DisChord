import { DisChordError, ErrorLevel } from "../../../../ChordError";
import { CollectorNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../../types";
import { SubGenerator } from "./../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";
import { DisChordGenerator } from "../../Generator";

/** Config for the Collector Generator param. */
interface CollectorConfig {
    variable: string;
    filter: string;
    time: string;
}

/**
 * Generator class responsible for generating code related to component collectors and their event handling in DisChord.
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

        const body = this.visitPulseIdMethod(
            this.parent.get(BDOVisitor).getODBProperty(node.methods, 'alPulsarId')
        );

        const filter = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node.methods, 'filtro')
        ) || 'interaccion.user.id === contexto.author.id';

        const time = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node.methods, 'tiempo')
        ) || '60000';

        const collectorConfig: CollectorConfig = {
            variable,
            filter,
            time
        };

        return this.generateCollector(collectorConfig, body);
    }

    /**
     * Generates the base collector initialization with a default author filter and 1-minute timeout.
     * @private
     * @param variable The message variable name to attach the collector to.
     * @param body The generated event listener methods.
     */
    private generateCollector (config: CollectorConfig, body: string): string {
        return `
            let collector = ${config.variable}.createComponentCollector({
                filter: (interaccion) => ${config.filter},
                timeout: ${config.time}
            });

            ${body}
        `;
    }

    /**
     * Maps a specific DisChord interaction method to the underlying framework listener.
     * @private
     * @param methodName The internal Seyfert collector method.
     * @param methodId The stringified custom_id to listen for.
     * @param code The visited code block to execute on interaction.
     */
    private generateMethod (methodName: 'run', methodId: string, code: string): string {
        return `
            collector.${methodName}(${methodId}, async (interaccion) => {
                ${code}
            })
        `;

    }

    /**
     * Traverses the nested BDO within 'alPulsarId'.
     * Maps each key (button ID) to its respective block of code.
     * @private
     * @param node The AST node containing ID keys and code block values.
     * @throws {DisChordError} If the node is not a valid BDO or lacks a body.
     * @returns Concatenated event listener code for all IDs in the block.
     */
    private visitPulseIdMethod (node: DisChordASTNode | undefined): string {
        if (!node) return '';

        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se esperaba un BDO con las ids a ejecutar después del 'alPulsarId'`,
            location: node.location
        }).format();

        const pulseCodes: string[] = Object.keys(node.blocks).map(identificator => {
            const idBody = node.blocks[identificator];

            if (!idBody || idBody.type != 'BDO' || idBody.body.length < 1) throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `Después de definir una ID para detectar pulsos, se esperaba un BDO con código.`,
                location: node.location
            }).format();
            
            return this.generateMethod(
                'run',
                `"${identificator}"`,
                (this.parent as DisChordGenerator).visit(idBody, { isInteraction: true })
            );
        });

        return pulseCodes.join('\n');
    }
}