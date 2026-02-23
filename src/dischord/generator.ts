import fs from "node:fs";
import { Generator } from "../chord/generator";
import { AccessNode, ASTNode, CallNode, ObjectPropertyType } from "../chord/types";
import { join } from "node:path";
import { corelib, createMessageFunctionInjection, EmbedColors, eventsMap, intentsMap } from "./core.lib";
import { ButtonStyles, CollectorNode, CommandNode, CommandParam, DisChordNodeType, EmbedBody, EmbedField, EventNode, MessageBodyNode, MessageButtonNode, MessageChannelNode, MessageContentNode, MessageEmbedNode, MessageNode, StartBotNode } from "./types";

export class DisChordGenerator extends Generator {
    projectRooth: string = '';

    constructor(symbols: Map<string, any>, projectRoot: string) {
        super(symbols);
        this.projectRooth = projectRoot;
    }

    override visit(node: ASTNode): string {
        switch (node.type as DisChordNodeType) {
            case 'EncenderBot':
                return this.generateBotInit(node as unknown as StartBotNode);
            case 'Evento':
                return this.generateDiscordEvent(node as unknown as EventNode);
            case 'CrearMensaje':
                return this.generateMessage(node as unknown as MessageNode);
            case 'CrearComando':
                return this.generateCommand(node as unknown as CommandNode);
            case 'CrearRecolector':
                return this.generateCollector(node as unknown as CollectorNode);
            default:
                return super.visit(node);
        }
    }

    override generateAccess(node: AccessNode): string {
        const objName = node.object.type === 'Identificador' ? node.object.value : null;
        const propName = node.property;

        if (objName && corelib[objName]) {
            const mapping = corelib[objName];
            
            if (typeof mapping === 'object' && mapping[propName]) {
                const translation = mapping[propName];
                
                if (translation.startsWith(objName + '.')) {
                    return translation;
                }
                return `${objName}.${translation}`;
            }
        }

        return super.generateAccess(node);
    }

    override generateCall(node: CallNode): string {
        if (node.object.type === 'Identificador') {
            const name = node.object.value;
            
            if (typeof corelib[name] === 'string') {
                const translation = corelib[name] as string;
                const args = node.params.map((arg: ASTNode) => this.visit(arg)).join(', ');
                return `${translation}(${args})`;
            }
        }

        return super.generateCall(node);
    }

    private generateBotInit(node: StartBotNode): string {
        if (node.object.type != 'Objeto') throw new Error(`Se encontró '${node.object.type}', se esperaba 'Objeto'`);

        const prefixNode = node.object.properties.find((p: ObjectPropertyType) => p.key === 'prefijo');
        const prefix = prefixNode ? this.visit(prefixNode.value) : '"!"';

        const seyfertConfig = this.generateSeyfertConfig(node);
        fs.writeFileSync(join(this.projectRooth, 'seyfert.config.mjs'), seyfertConfig, 'utf-8');

        if (!fs.existsSync(join(this.projectRooth, 'dist', 'commands'))) fs.mkdirSync(join(this.projectRooth, 'dist', 'commands'), { recursive: true });
        if (!fs.existsSync(join(this.projectRooth, 'dist', 'events'))) fs.mkdirSync(join(this.projectRooth, 'dist', 'events'), { recursive: true });
        if (!fs.existsSync(join(this.projectRooth, 'dist', 'components'))) fs.mkdirSync(join(this.projectRooth, 'dist', 'components'), { recursive: true });

        return `
            import { Client } from "seyfert";
            const client = new Client({
                commands: {
                    prefix: () => [ ${prefix} ],
                    reply: () => true
                }
            });

            client.setServices({
                cache: {
                    disabledCache: { bans: true, emojis: true, stickers: true, roles: true, presences: true }
                }
            });

            client.start().then(async () => {
                await client.uploadCommands().catch(error => console.log(error));
            });

            process.on('unhandledRejection', async (err) => {
                console.error(err);
            });
        `;
    }

    public generateSeyfertConfig(node: StartBotNode): string {
        if (node.object.type != 'Objeto') throw new Error(`Se encontró '${node.object.type}', se esperaba 'Objeto'`);
        const tokenNode = node.object.properties.find((property: ObjectPropertyType) => property.key === 'token');
        const intentsNode = node.object.properties.find((property: ObjectPropertyType) => property.key === 'intenciones');
        const token = tokenNode ? this.visit(tokenNode.value) : '""';
        
        let intents = "[]";

        
        if (intentsNode && intentsNode.value.type === 'Lista') {
            const list = intentsNode.value.body.map((item: ASTNode): string => {
                if (!('value' in item)) return '';
                if (!item.value) return '';

                const val = item.value.toString().replace(/"/g, '');
                return `"${intentsMap[val]}"`;
            });
            intents = `[\n        ${list.join(',\n        ')}\n    ]`;
        }

        return `
            import { GatewayIntentBits } from "seyfert/lib/types/index.js";
            import { config } from "seyfert";

            export default config.bot({
                token: ${token},
                intents: ${intents},
                locations: {
                    base: "dist",
                    commands: "commands",
                    events: "events",
                    components: "components"
                }
            });
        `;
    }

    private generateDiscordEvent(node: EventNode): string {
        const eventName = eventsMap[node.name]?.name;
        if (!eventName) throw new Error(`El evento ${node.name} no existe`);

        const body = node.body
            .map((n: ASTNode): string => "    " + this.visit(n) + ";")
            .join('\n');

        const eventBody: string = `
            import { createEvent, Embed } from 'seyfert';

            export default createEvent({
                data: { name: '${eventName}' },
                async run(${eventsMap[node.name].params.join(', ')}) {
                ${createMessageFunctionInjection}
                ${body}
                }
            });
        `;

        fs.writeFileSync(join(this.projectRooth, 'dist', 'events', `${eventName}.js`), eventBody, 'utf-8');

        return '';
    }

    private generateCommand(node: CommandNode): string {
        const commandName = node.value;
        const commandDescription = node.params.find((param: CommandParam) => param.property === 'descripcion');
        if (!commandDescription) throw new Error('Se requiere descripción para el comando.');
        const body = node.body
            .map((n: ASTNode): string => "    " + this.visit(n) + ";")
            .join('\n');

        const commandBody: string = `
            import { Command, IgnoreCommand, Embed, ActionRow, Button } from 'seyfert';

            export default class ${commandName}Command extends Command {
                name = "${commandName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() /*slugified*/}";
                description = ${this.visit(commandDescription.value) ?? '"Un comando genial"'};
                ignore = IgnoreCommand.Message;
                integrationTypes = [ 0 ];
                contexts = [ 0 ];
                async run(ctx) {
                    const contexto = ctx;
                    const cliente = contexto.client;
                    const usuario = contexto.author;
                    const canal = contexto.interaction.channel;

                    ${createMessageFunctionInjection}

                    ${body}
                }
            }
        `;

        fs.writeFileSync(join(this.projectRooth, 'dist', 'commands', `${commandName}.js`), commandBody, 'utf-8');
        return '';
    }

    private generateMessage(node: MessageNode): string {
        const channelNode: MessageChannelNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'canal');
        const channel: string | undefined = channelNode ? this.visit(channelNode.channel) : undefined;
        const contentNode: MessageContentNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'contenido');
        const content: string | undefined = contentNode ? this.visit(contentNode.content) : undefined;
        const EmbedsNode: MessageEmbedNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'embed');
        const embed: string = EmbedsNode? `, embeds: [ ${this.generateEmbed(EmbedsNode.embed)} ] ` : '';
        const ButtonsNode: MessageButtonNode | undefined = node.body.find((BodyNode: MessageBodyNode) => BodyNode.property === 'boton');
        const button: string = ButtonsNode? `, components: [ new ActionRow().setComponents([ ${this.generateButtonRow(ButtonsNode)} ]) ]` : '';

        return `createMessage(${channel}, { content: ${content} ${embed}${button} })`;
    }

    private generateEmbed(node: EmbedBody): string {
        const ColorVisit: string | undefined = node.color? this.visit(node.color.object) : '""';
        const ResolvingColors: string | undefined = Object.keys(EmbedColors).includes(ColorVisit.slice(1, -1))? `"${EmbedColors[ColorVisit.slice(1, -1)]}"` : undefined;
        const ColorResolved = ResolvingColors? `.setColor(${ResolvingColors})` : '';
        
        const TitleResolved: string = node.titulo? `.setTitle(${this.visit(node.titulo.object)})` : '';

        const ResolvingAuthor: Record<'name', string> & Record<'iconUrl', string> | undefined = node.autor? {
            name: this.visit(node.autor.name),
            iconUrl: this.visit(node.autor.iconUrl)
        } : undefined;
        const AuthorResolved: string = ResolvingAuthor? `.setAuthor({ text: ${ResolvingAuthor.name === '$CLIENTNAME'? 'usuario.username' : ResolvingAuthor.name}, iconUrl: ${ResolvingAuthor.iconUrl === '$CLIENTURL'? 'usuario.avatarURL()' : ResolvingAuthor.iconUrl} })` : '';

        const DescriptionResolved: string = node.descripcion? `.setDescription(${this.visit(node.descripcion.object)})` : '';
        const TimestampResolved: string = node.hora? `.setTimestamp()` : '';
        const ImageResolved: string = node.imagen? `.setImage(${this.visit(node.imagen.object)})` : '';
        const ThumbnailResolved: string = node.cartel? `.setThumbnail${this.visit(node.cartel.object)})` : '';

       const FieldsResolved: string = node.campos.length > 0?
            node.campos.map((Field: EmbedField): string => {
                return `.addFields({ text: ${this.visit(Field.text)}, value: ${this.visit(Field.value)}, inline: ${this.visit(Field.inline)} })`;
            })
            .join('\n')
        : '';

        const ResolvingFooter: Record<'text', string> & Record<'iconUrl', string | undefined> | undefined = node.pie? {
            text: this.visit(node.pie.text),
            iconUrl: node.pie.iconUrl? this.visit(node.pie.iconUrl): undefined
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

    private generateButtonRow(node: MessageButtonNode): string {
        const StyleString: string = this.visit(node.style).slice(1, -1);
        if (!(StyleString in ButtonStyles)) throw new Error(`Estilo inválido: '${StyleString}'`);
        const ButtonStyle = ButtonStyles[StyleString as keyof typeof ButtonStyles];

        return `
            new Button()
                .setCustomId(${this.visit(node.id)})
                .setLabel(${this.visit(node.label)})
                .setStyle(${ButtonStyle})
                ${node.emoji? `.setEmoji(${this.visit(node.emoji)})` : ''}
        `;
    }

    private generateCollector(node: CollectorNode): string {
        return `let collector = ${this.visit(node.variable)}.createComponentCollector()`;
    }
}