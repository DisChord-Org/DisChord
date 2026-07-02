import { DisChordError, ErrorLevel } from "../../../../ChordError";
import { EmbedColors } from "../../constants/mappings";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";

/**
 * Generator class responsible for generating code related to message embeds in DisChord.
 */
export default class EmbedVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = undefined;

    /**
     * Helper method to generate the embed array structure by searching for the 
     * 'embed' property within a given ODBNode.
     * * It automates the extraction and generation process, returning a formatted 
     * string ready to be injected into a JavaScript object.
     * * @param node The parent ODBNode containing a potential 'embed' definition.
     * @returns A string containing the embeds or an empty string if no embed property is defined.
     */
    visitIfNodeExists (node: DisChordODBNode | undefined): string {
        if (!node) return '';

        const embed = this.parent.get(BDOVisitor).getODBProperty(node, 'embed');

        return embed ? `, embeds: [ ${this.visit(embed)} ] ` : '';
    }

    /**
     * Entry point for embed code generation.
     * Maps the BDO (Object Data Block) properties to their corresponding Embed builder methods.
     * @param node The AST node (must be of type 'BDO') containing embed definitions.
     * @throws Error if the node is not a BDO.
     * @returns A string representing the instantiation and configuration of a new Embed.
     */
    visit (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Parser,
            message: `Se esperaba un BDO, se recibió '${node.type}'`,
            location: node.location
        }).format();
        
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
    private resolveColors (node: DisChordODBNode): string {
        const color = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'color')
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
    private resolveTitle (node: DisChordODBNode): string {
        const title = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'titulo')
        );

        if (!title) return '';

        return `.setTitle(${title})`;
    }

    /**
     * Resolves the 'autor' block, including nested 'nombre' and 'icono' properties.
     * @private
     * @returns The generated setAuthor call or an empty string if the author is not defined.
     */
    private resolveAuthor (node: DisChordODBNode): string {
        const author = this.parent.get(BDOVisitor).getODBProperty(node, 'autor');

        if (!author) return '';

        const name = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'nombre')
        ) || 'usuario.username';

        const iconUrl = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'icono')
        );

        return `.setAuthor({ text: ${name}, iconUrl: ${iconUrl} })`
    }

    /**
     * Resolves the 'descripcion' property.
     * @private
     * @returns The generated setDescription call or an empty string if the description is not defined.
     */
    private resolveDescription (node: DisChordODBNode): string {
        const description = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'descripcion')
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
    private resolveTimestamp (node: DisChordODBNode): string {
        const timestamp = this.parent.get(BDOVisitor).getODBProperty(node, 'hora');

        if (!timestamp) return '';

        return '.setTimestamp()';
    }

    /**
     * Resolves the 'imagen' URL property.
     * @private
     * @returns The generated setImage call or an empty string if the image is not defined.
     */
    private resolveImage (node: DisChordODBNode): string {
        const image = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'imagen')
        );

        if (!image) return '';

        return `.setImage(${image})`;
    }

    /**
     * Resolves the 'cartel' URL property.
     * @private
     * @returns The generated setThumbnail call or an empty string if the thumbnail is not defined.
     */
    private resolveThumbnail (node: DisChordODBNode): string {
        const thumbnail = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(node, 'cartel')
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
    private resolveFields (node: DisChordODBNode): string {
        const fields = this.parent.get(BDOVisitor).getODBProperty(node, 'campos');

        if (!fields || fields.type != 'Lista' || fields.body.length < 1) return '';

        const FieldsResolved: string = fields.body.map((Field: DisChordASTNode): string => {
            if (Field.type != 'BDO') throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `Se esperaba un BDO para el campo, se recibió '${Field.type}'`,
                location: node.location
            }).format();
            
            const name = this.parent.visitIfExists(
                this.parent.get(BDOVisitor).getODBProperty(Field, 'titulo')
            );

            if (!name) throw new DisChordError({
                phase: ErrorLevel.Compiler,
                message: `El campo requiere una propiedad 'titulo'`,
                location: node.location
            }).format();

            const value = this.parent.visitIfExists(
                this.parent.get(BDOVisitor).getODBProperty(Field, 'descripcion')
            ) || '';

            const inline = this.parent.visitIfExists(
                this.parent.get(BDOVisitor).getODBProperty(Field, 'lineado')
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
    private resolveFooter (node: DisChordODBNode): string {
        const footer = this.parent.get(BDOVisitor).getODBProperty(node, 'pie');

        if (!footer || footer.type != 'BDO') return '';

        const text = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(footer, 'texto')
        );

        if (!text) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `El pie de página requiere una propiedad 'text'`,
            location: node.location
        }).format();

        const iconUrl = this.parent.visitIfExists(
            this.parent.get(BDOVisitor).getODBProperty(footer, 'icono')
        );

        return `.setFooter({ text: ${text}, iconUrl: ${iconUrl} })`;
    }
}