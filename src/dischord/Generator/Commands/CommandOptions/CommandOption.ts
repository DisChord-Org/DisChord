import { DisChordError, ErrorLevel } from "../../../../ChordError";
import { DisChordTypeMap } from "../../../core.lib";
import { DisChordASTNode, DisChordODBNode, DiscordOptionType } from "../../../types";
import { DisChordGenerator } from "../../generator";
import { SubGenerator } from "../../subgenerator";

export default class CommandOptionGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "opciones";

    private lastGeneratedOptions: string[] = [];

    /**
     * @param parent The context of the CommandGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    public getExtractionCode(): string {
        if (this.lastGeneratedOptions.length === 0) return '';
        
        return `const { ${this.lastGeneratedOptions.join(', ')} } = ctx.options;`;
    }

    generateIfNodeExists (node: DisChordODBNode): string {
        const options = this.getODBProperty(node, 'opciones');

        return options? `const options = [${this.generate(options)}];` : '';
    }

    generate (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError(
            ErrorLevel.Compiler,
            `Se esperaba un BDO, se recibió '${node.type}'`,
            node.location
        ).format();

        const optionNames = Object.keys(node.blocks);
        this.lastGeneratedOptions = optionNames;
    
        const results = optionNames.map(OptionName => {
            const OptionNode = node.blocks[OptionName] as DisChordODBNode;
            const OptionType = DisChordTypeMap[this.getOptionType(OptionNode)];

            if (!OptionType) {
                throw new DisChordError(
                    ErrorLevel.Compiler,
                    `Tipo de opción '${Option}' no reconocido en '${OptionName}'`,
                    OptionNode.location
                ).format();
            }

            // Currently, only string options are supported. This can be expanded in the future to support more types.
            switch (OptionType) {
                case DiscordOptionType.String:
                    return this.generateStringOption(OptionName, OptionNode);
                default:
                    return '';
            }
        });

        return results.join(', ');
    }

    private getOptionType (node: DisChordODBNode): string {
        const OptionType = this.visitIfExists(
            this.getODBProperty(node, 'opcion')
        );

        return (OptionType ?? '').replace(/"/g, '').toLowerCase();
    }

    private generateStringOption (name: string, node: DisChordODBNode): string {
        const description = this.visitIfExists(
            this.getODBProperty(node, 'descripcion')
        );

        if (!description) throw new DisChordError(
            ErrorLevel.Compiler,
            `En la declaración de la opción tipo 'String', se esperaba 'descripcion'.`,
            node.location
        ).format();

        const required = this.visitIfExists(
            this.getODBProperty(node, 'requerido')
        );

        if (!required) throw new DisChordError(
            ErrorLevel.Compiler,
            `En la declaración de la opción tipo 'String', se esperaba 'requerido'.`,
            node.location
        ).format();

        return `
            {
                name: "${name}",
                description: ${description},
                required: ${required},
                type: 3
            }
        `;
    }
}