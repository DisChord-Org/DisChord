import { EmbedColors } from "../../../core.lib";
import { DisChordASTNode, EmbedField, ODBNode } from "../../../types";
import { DisChordGenerator } from "../../generator";
import { SubGenerator } from "../../subgenerator";
import MessageGenerator from "../MessageGenerator";

/**
 * Generator class responsible for generating code related to message embeds in DisChord.
 */
export default class EmbedGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "embed";

    /**
     * @param parent The context of the MessageGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    /**
     * Generates code for an DisChordASTNode, which represents an Embed in DisChord.
     * * @static
     * @param node The DisChordASTNode representing the embed to generate code for.
     * @returns The generated AST for the embed component.
     */
    generate (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new Error(`Se esperaba un BDO, se recibió '${node.type}'`);
        
        const ResolvedColor = this.resolveColors(node);
        const ResolvedTitle = this.resolveTitle(node);
        const ResolvedAuthor = this.resolveAuthor(node);
        const ResolvedDescription = this.resolveDescription(node);
        const ResolvedTimestamp = this.resolveTimestamp(node);

        const ImageResolved: string = node.imagen? `.setImage(${this.ctx.MessageGeneratorContext.visit(node.imagen.object)})` : '';
        const ThumbnailResolved: string = node.cartel? `.setThumbnail${this.ctx.MessageGeneratorContext.visit(node.cartel.object)})` : '';

       const FieldsResolved: string = node.campos.length > 0?
            node.campos.map((Field: EmbedField): string => {
                return `.addFields({ text: ${this.ctx.MessageGeneratorContext.visit(Field.text)}, value: ${this.ctx.MessageGeneratorContext.visit(Field.value)}, inline: ${this.ctx.MessageGeneratorContext.visit(Field.inline)} })`;
            })
            .join('\n')
        : '';

        const ResolvingFooter: Record<'text', string> & Record<'iconUrl', string | undefined> | undefined = node.pie? {
            text: this.ctx.MessageGeneratorContext.visit(node.pie.text),
            iconUrl: node.pie.iconUrl? this.ctx.MessageGeneratorContext.visit(node.pie.iconUrl): undefined
        } : undefined;
        const FooterResolved: string = ResolvingFooter? `.setFooter({ text: ${ResolvingFooter.text === '$CLIENTNAME'? 'usuario.username' : ResolvingFooter.text}, iconUrl: ${ResolvingFooter.iconUrl})` : '';

        return `
            new Embed()
                ${ResolvedColor}
                ${ResolvedTitle}
                ${ResolvedAuthor}
                ${ResolvedDescription}
                ${ResolvedTimestamp}
                ${ImageResolved}
                ${ThumbnailResolved}
                ${FieldsResolved}
                ${FooterResolved}
        `;
    }

    private resolveColors (node: ODBNode): string {
        const color = this.visitIfExists(
            this.getODBProperty(node, 'color')
        );

        if (!color) return '';

        const RawColor = color.slice(1, -1);
        
        if (!Object.keys(EmbedColors).includes(RawColor)) return '';

        return `.setColor("${EmbedColors[RawColor]}")`;
    }

    private resolveTitle (node: ODBNode): string {
        const title = this.visitIfExists(
            this.getODBProperty(node, 'titulo')
        );

        if (!title) return '';

        return `.setTitle(${title})`;
    }

    private resolveAuthor (node: ODBNode): string {
        const author = this.getODBProperty(node, 'autor');

        if (!author) return '';

        const name = this.visitIfExists(
            this.getODBProperty(node, 'nombre')
        ) || 'usuario.username';

        const iconUrl = this.visitIfExists(
            this.getODBProperty(node, 'icono')
        );

        return `.setAuthor({ text: ${name}, iconUrl: ${iconUrl} })`
    }

    private resolveDescription (node: ODBNode): string {
        const description = this.visitIfExists(
            this.getODBProperty(node, 'descripcion')
        );

        if (!description) return '';
        
        return `.setDescription(${description})`;
    }

    private resolveTimestamp (node: ODBNode): string {
        const timestamp = this.getODBProperty(node, 'hora');

        if (!timestamp) return '';

        return '.setTimestamp()';
    }
}