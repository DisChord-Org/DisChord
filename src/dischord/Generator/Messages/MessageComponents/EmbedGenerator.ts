import { DisChordError, ErrorLevel } from "../../../../ChordError";
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
     * Helper method to generate the embed array structure by searching for the 
     * 'embed' property within a given ODBNode.
     * * It automates the extraction and generation process, returning a formatted 
     * string ready to be injected into a JavaScript object.
     * * @param node The parent ODBNode containing a potential 'embed' definition.
     * @returns A string containing the embeds or an empty string if no embed property is defined.
     */
    generateIfNodeExists (node: ODBNode | undefined): string {
        if (!node) return '';

        const embed = this.getODBProperty(node, 'embed');

        return embed ? `, embeds: [ ${this.generate(embed)} ] ` : '';
    }

    /**
     * Entry point for embed code generation.
     * Maps the BDO (Object Data Block) properties to their corresponding Embed builder methods.
     * @param node The AST node (must be of type 'BDO') containing embed definitions.
     * @throws Error if the node is not a BDO.
     * @returns A string representing the instantiation and configuration of a new Embed.
     */
    generate (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError(
            ErrorLevel.Parser,
            `Se esperaba un BDO, se recibió '${node.type}'`,
            node.location,
            this.parent.input.split('\n')[node.location.line - 1] || ''
        ).format();
        
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
     * @returns The generated setColor call or an empty string if the color is not defined.
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
     * @returns The generated setTitle call or an empty string if the title is not defined.
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
     * @returns The generated setAuthor call or an empty string if the author is not defined.
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
     * @returns The generated setDescription call or an empty string if the description is not defined.
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
     * @return The generated setTimestamp call or an empty string if the timestamp is not defined.
     */
    private resolveTimestamp (node: ODBNode): string {
        const timestamp = this.getODBProperty(node, 'hora');

        if (!timestamp) return '';

        return '.setTimestamp()';
    }

    /**
     * Resolves the 'imagen' URL property.
     * @private
     * @returns The generated setImage call or an empty string if the image is not defined.
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
     * @returns The generated setThumbnail call or an empty string if the thumbnail is not defined.
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
     * @returns The generated addFields call with an array of field objects or an empty string if no fields are defined.
     */
    private resolveFields (node: ODBNode): string {
        const fields = this.getODBProperty(node, 'campos');

        if (!fields || fields.type != 'Lista' || fields.body.length < 1) return '';

        const FieldsResolved: string = fields.body.map((Field: DisChordASTNode): string => {
            if (Field.type != 'BDO') throw new DisChordError(
                ErrorLevel.Compiler,
                `Se esperaba un BDO para el campo, se recibió '${Field.type}'`,
                node.location,
                this.parent.input.split('\n')[node.location.line - 1] || ''
            ).format();
            
            const name = this.visitIfExists(
                this.getODBProperty(Field, 'titulo')
            );

            if (!name) throw new DisChordError(
                ErrorLevel.Compiler,
                `El campo requiere una propiedad 'titulo'`,
                node.location,
                this.parent.input.split('\n')[node.location.line - 1] || ''
            ).format();

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
     * @returns The generated setFooter call with the specified text and optional iconUrl, or an empty string if 'pie' is not defined.
     */
    private resolveFooter (node: ODBNode): string {
        const footer = this.getODBProperty(node, 'pie');

        if (!footer || footer.type != 'BDO') return '';

        const text = this.visitIfExists(
            this.getODBProperty(footer, 'texto')
        );

        if (!text) throw new DisChordError(
            ErrorLevel.Compiler,
            `El pie de página requiere una propiedad 'text'`,
            node.location,
            this.parent.input.split('\n')[node.location.line - 1] || ''
        ).format();

        const iconUrl = this.visitIfExists(
            this.getODBProperty(footer, 'icono')
        );

        return `.setFooter({ text: ${text}, iconUrl: ${iconUrl} })`;
    }
}