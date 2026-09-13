import { DisChordError, ErrorLevel } from "../../../../errors/ChordError";
import { EmbedColors } from "../../constants/mappings";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { BDOResolver } from "../../../../chord/Generator/BDOResolver";
import { TokenType, TokenTypeUnion } from "../../../../chord/types";
import { BDOVisitor } from "../../../../chord/Generator/visitors/expressions/BDOVisitor";
import { EmbedFieldSchema, EmbedFooterSchema, EmbedSchema } from "../../constants/schemas";

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
     *
     * The property's value can be:
     * - an anonymous inline embed (a BDO, e.g. `embed { titulo "..."; }`), wrapped into
     *   `new Embed()...` by this visitor's own chain-building `visit()`;
     * - any other expression referencing a previously declared, reusable embed (e.g. `embed
     *   Bienvenida`), delegated to the generic dispatcher instead, since it's already a complete,
     *   valid Embed-producing expression on its own;
     * - or a list mixing either of the above (`embed [ { titulo "Uno" } Bienvenida ]`), for
     *   sending more than one embed in the same message — each element resolved the same way.
     *
     * @param node The parent ODBNode containing a potential 'embed' definition.
     * @returns A string containing the embeds or an empty string if no embed property is defined.
     */
    visitIfNodeExists (node: DisChordODBNode | undefined): string {
        if (!node) return '';

        const embed = this.parent.get(BDOVisitor).getODBProperty(node, 'embed');
        if (!embed) return '';

        const embedsCode = embed.type === TokenType.LISTA
            ? embed.body.map(item => this.resolveEmbedExpression(item)).join(', ')
            : this.resolveEmbedExpression(embed);

        return `, embeds: [ ${embedsCode} ] `;
    }

    /**
     * Resolves a single embed-producing expression: an anonymous inline BDO gets wrapped via
     * `visit()`, anything else (a reference to an already-declared embed) is passed through as-is.
     * Shared by `visitIfNodeExists`'s single-embed and list-of-embeds paths.
     * @private
     */
    private resolveEmbedExpression (embed: DisChordASTNode): string {
        return embed.type === TokenType.BDO ? this.visit(embed) : this.parent.visit(embed);
    }

    /**
     * Entry point for embed code generation.
     * Maps the BDO (Object Data Block) properties to their corresponding Embed builder methods.
     * @param node The AST node (must be of type 'BDO') containing embed definitions.
     * @throws Error if the node is not a BDO.
     * @returns A string representing the instantiation and configuration of a new Embed.
     */
    visit (node: DisChordASTNode): string {
        return `new Embed()${this.buildChain(node)}`;
    }

    /**
     * Resolves a BDO's properties into the `.setX(...)` method chain alone, without the leading
     * `new Embed()`. Shared by `visit()` (the anonymous inline form) and `EmbedDeclarationVisitor`
     * (the named, reusable `embed <Nombre> { ... }` form), so both produce identical output.
     *
     * The simple pass-through fields (`titulo`, `descripcion`, `imagen`, `cartel`, and `color`'s
     * raw value before its named-color lookup) come straight out of {@link EmbedSchema} via
     * `BDOResolver` in one call — the same schema the Analyzer's `ValidateEmbedsRule` already
     * validated `node` against (which also covers `campos`/`pie`'s own requirements, resolved here
     * by hand since their output shape — a list of objects, a nested `setFooter` call — doesn't
     * reduce to a single value the way the others do). `autor` (two sub-properties plus a default)
     * and `hora` (presence alone, no value at all) don't fit that shape either.
     * @param node The AST node (must be of type 'BDO') containing embed definitions.
     * @throws Error if the node is not a BDO.
     * @returns The `.setX(...)` method chain, without the `new Embed()` prefix.
     */
    buildChain (node: DisChordASTNode): string {
        if (node.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Parser,
            message: `Se esperaba un BDO, se recibió '${node.type}'`,
            location: node.location
        }).format();

        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));
        const fields = resolver.resolve(node, EmbedSchema);

        const ResolvedColor = this.resolveColor(fields['color']);
        const ResolvedTitle = fields['titulo'] ? `.setTitle(${fields['titulo']})` : '';
        const ResolvedAuthor = this.resolveAuthor(node);
        const ResolvedDescription = fields['descripcion'] ? `.setDescription(${fields['descripcion']})` : '';
        const ResolvedTimestamp = node.blocks['hora'] ? '.setTimestamp()' : '';
        const ResolvedImage = fields['imagen'] ? `.setImage(${fields['imagen']})` : '';
        const ResolvedThumbnail = fields['cartel'] ? `.setThumbnail(${fields['cartel']})` : '';
        const ResolvedFields = this.resolveFields(node);
        const ResolvedFooter = this.resolveFooter(node);

        return `
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
     * Resolves the already-visited 'color' value: a quoted string (`color "Verde"`) is looked up
     * in the Spanish named-color mapping; anything else (a variable, a property access like
     * `mencion.colorPerfil`, a hex/decimal literal, ...) is passed straight through to `setColor`,
     * since Discord's color field already accepts a raw resolvable value and there's no fixed
     * Spanish name to translate for an arbitrary expression.
     * @private
     * @returns The generated setColor call or an empty string if the color is not defined.
     */
    private resolveColor (color: string): string {
        if (!color) return '';

        const isStringLiteral = color.startsWith('"') && color.endsWith('"');
        if (!isStringLiteral) return `.setColor(${color})`;

        const RawColor = color.slice(1, -1);

        if (!Object.keys(EmbedColors).includes(RawColor)) return '';

        return `.setColor("${EmbedColors[RawColor]}")`;
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
     * Resolves the 'campos' list.
     * Iterates through a list of BDOs, resolving each one against {@link EmbedFieldSchema} — the
     * same schema the Analyzer's `ValidateEmbedsRule` already validated every entry against.
     * @private
     * @returns The generated addFields call with an array of field objects or an empty string if no fields are defined.
     */
    private resolveFields (node: DisChordODBNode): string {
        const fields = this.parent.get(BDOVisitor).getODBProperty(node, 'campos');

        if (!fields || fields.type != 'Lista' || fields.body.length < 1) return '';

        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));

        const FieldsResolved: string = fields.body.map((Field: DisChordASTNode): string => {
            const field = resolver.resolve(Field as DisChordODBNode, EmbedFieldSchema);

            return `{ name: ${field['titulo']}, value: ${field['descripcion']}, inline: ${field['lineado']} }`;
        }).join(',\n');

        return `.addFields(${FieldsResolved})`;
    }

    /**
     * Resolves the 'pie' block against {@link EmbedFooterSchema} — the same schema the Analyzer's
     * `ValidateEmbedsRule` already validated it against (requiring a 'texto' property).
     * @private
     * @returns The generated setFooter call with the specified text and optional iconUrl, or an empty string if 'pie' is not defined.
     */
    private resolveFooter (node: DisChordODBNode): string {
        const footer = this.parent.get(BDOVisitor).getODBProperty(node, 'pie');

        if (!footer || footer.type != 'BDO') return '';

        const resolver = new BDOResolver<DisChordNodeType, DisChordNode>(expression => this.parent.visit(expression));
        const resolved = resolver.resolve(footer, EmbedFooterSchema);

        return `.setFooter({ text: ${resolved['texto']}, iconUrl: ${resolved['icono']} })`;
    }
}
