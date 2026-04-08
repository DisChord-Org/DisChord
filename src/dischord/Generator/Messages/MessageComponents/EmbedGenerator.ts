import { EmbedColors } from "../../../core.lib";
import { DisChordASTNode, ODBNode } from "../../../types";
import { DisChordGenerator } from "../../generator";
import { SubGenerator } from "../../subgenerator";

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
     * Helper method to generate the embed array structure if the node exists.
     * Useful for embedding the result directly into a message components object.
     * @param node The potential DisChordASTNode for the embed.
     * @returns A formatted string containing the 'embeds' key and the generated embed, or an empty string.
     */
    generateIfNodeExists (node: DisChordASTNode | undefined): string {
        return node ? `, embeds: [ ${this.generate(node)} ] ` : '';
    }

    /**
     * Generates code for an DisChordASTNode, which represents an Embed in DisChord.
     * * @param node The DisChordASTNode representing the embed to generate code for.
     * @returns The generated AST for the embed component.
     */
    generate (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new Error(`Se esperaba un BDO, se recibió '${node.type}'`);
        
        const ResolvedColor = this.resolveColors(node);
        const ResolvedTitle = this.resolveTitle(node);
        const ResolvedAuthor = this.resolveAuthor(node);
        const ResolvedDescription = this.resolveDescription(node);
        const ResolvedTimestamp = this.resolveTimestamp(node);
        const ResolvedImage = this.resolveImage(node);
        const ResolvedThumbnail = this.resolveThumbnail(node);
        const ResolvedFields = this.resolveFields(node);
        const ResolvedFooter = this.resolveFooter(node);

        return `
            new Embed()
                ${ResolvedColor}
                ${ResolvedTitle}
                ${ResolvedAuthor}
                ${ResolvedDescription}
                ${ResolvedTimestamp}
                ${ResolvedImage}
                ${ResolvedThumbnail}
                ${ResolvedFields}
                ${ResolvedFooter}
        `;
    }

    /**
     * Resolves the 'color' property using the core library mapping.
     * @private
     */
    private resolveColors (node: ODBNode): string {
        const color = this.visitIfExists(
            this.getODBProperty(node, 'color')
        );

        if (!color) return '';

        const RawColor = color.slice(1, -1);
        
        if (!Object.keys(EmbedColors).includes(RawColor)) return '';

        return `.setColor("${EmbedColors[RawColor]}")`;
    }

    /**
     * Resolves the 'titulo' property.
     * @private
     */
    private resolveTitle (node: ODBNode): string {
        const title = this.visitIfExists(
            this.getODBProperty(node, 'titulo')
        );

        if (!title) return '';

        return `.setTitle(${title})`;
    }

    /**
     * Resolves the 'autor' block, including nested 'nombre' and 'icono' properties.
     * @private
     */
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

    /**
     * Resolves the 'descripcion' property.
     * @private
     */
    private resolveDescription (node: ODBNode): string {
        const description = this.visitIfExists(
            this.getODBProperty(node, 'descripcion')
        );

        if (!description) return '';
        
        return `.setDescription(${description})`;
    }

    /**
     * Resolves the 'hora' property. 
     * If present, triggers the setTimestamp() method.
     * @private
     */
    private resolveTimestamp (node: ODBNode): string {
        const timestamp = this.getODBProperty(node, 'hora');

        if (!timestamp) return '';

        return '.setTimestamp()';
    }

    /**
     * Resolves the 'imagen' URL property.
     * @private
     */
    private resolveImage (node: ODBNode): string {
        const image = this.visitIfExists(
            this.getODBProperty(node, 'imagen')
        );

        if (!image) return '';


        return `.setImage(${image})`;
    }

    /**
     * Resolves the 'cartel' URL property.
     * @private
     */
    private resolveThumbnail (node: ODBNode): string {
        const thumbnail = this.visitIfExists(
            this.getODBProperty(node, 'cartel')
        );

        if (!thumbnail) return '';

        return `.setThumbnail(${thumbnail})`;
    }

    /**
     * Resolves the 'campos' list. 
     * Iterates through a list of BDOs to generate an array of field objects.
     * @private
     * @throws Error if a field is not a BDO or lacks a 'titulo'.
     */
    private resolveFields (node: ODBNode): string {
        const fields = this.getODBProperty(node, 'campos');

        if (!fields || fields.type != 'Lista' || fields.body.length < 1) return '';

        const FieldsResolved: string = fields.body.map((Field: DisChordASTNode): string => {
            if (Field.type != 'BDO') throw new Error(`Se esperaba un BDO para el campo, se recibió '${Field.type}'`);
            
            const name = this.visitIfExists(
                this.getODBProperty(Field, 'titulo')
            );

            if (!name) throw new Error("El campo requiere una propiedad 'titulo'");

            const value = this.visitIfExists(
                this.getODBProperty(Field, 'descripcion')
            ) || '';

            const inline = this.visitIfExists(
                this.getODBProperty(Field, 'lineado')
            ) || 'false';

            return `{ name: ${name}, value: ${value}, inline: ${inline} }`;
        }).join(',\n');

        return `.addFields(${FieldsResolved})`;
    }

    /**
     * Resolves the 'pie' block, requiring a 'texto' property.
     * @private
     * @throws Error if 'pie' is present but lacks 'texto'.
     */
    private resolveFooter (node: ODBNode): string {
        const footer = this.getODBProperty(node, 'pie');

        if (!footer || footer.type != 'BDO') return '';

        const text = this.visitIfExists(
            this.getODBProperty(footer, 'texto')
        );

        if (!text) throw new Error("El pie de página requiere una propiedad 'texto'");

        const iconUrl = this.visitIfExists(
            this.getODBProperty(footer, 'icono')
        );

        return `.setFooter({ text: ${text}, iconUrl: ${iconUrl} })`;
    }
}