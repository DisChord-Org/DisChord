import { EmbedColors } from "../../../core.lib";
import { EmbedBody, EmbedField } from "../../../types";
import MessageGenerator from "../MessageGenerator";

export default class EmbedGenerator {
    constructor (private ctx: MessageGenerator) {}

    generate (node: EmbedBody): string {
        const ColorVisit: string | undefined = node.color? this.ctx.MessageGeneratorContext.visit(node.color.object) : '""';
        const ResolvingColors: string | undefined = Object.keys(EmbedColors).includes(ColorVisit.slice(1, -1))? `"${EmbedColors[ColorVisit.slice(1, -1)]}"` : undefined;
        const ColorResolved = ResolvingColors? `.setColor(${ResolvingColors})` : '';
        
        const TitleResolved: string = node.titulo? `.setTitle(${this.ctx.MessageGeneratorContext.visit(node.titulo.object)})` : '';

        const ResolvingAuthor: Record<'name', string> & Record<'iconUrl', string> | undefined = node.autor? {
            name: this.ctx.MessageGeneratorContext.visit(node.autor.name),
            iconUrl: this.ctx.MessageGeneratorContext.visit(node.autor.iconUrl)
        } : undefined;
        const AuthorResolved: string = ResolvingAuthor? `.setAuthor({ text: ${ResolvingAuthor.name === '$CLIENTNAME'? 'usuario.username' : ResolvingAuthor.name}, iconUrl: ${ResolvingAuthor.iconUrl === '$CLIENTURL'? 'usuario.avatarURL()' : ResolvingAuthor.iconUrl} })` : '';

        const DescriptionResolved: string = node.descripcion? `.setDescription(${this.ctx.MessageGeneratorContext.visit(node.descripcion.object)})` : '';
        const TimestampResolved: string = node.hora? `.setTimestamp()` : '';
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
                ${ColorResolved}
                ${TitleResolved}
                ${AuthorResolved}
                ${DescriptionResolved}
                ${TimestampResolved}
                ${ImageResolved}
                ${ThumbnailResolved}
                ${FieldsResolved}
                ${FooterResolved}
        `;
    }
}