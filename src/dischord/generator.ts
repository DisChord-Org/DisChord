import fs from "node:fs";
import { Generator } from "../chord/generator";
import { ASTNode } from "../chord/types";
import { join } from "node:path";
import { corelib, EmbedColors, eventsMap, intentsMap } from "./core.lib";

export class DisChordGenerator extends Generator {
    projectRooth: string = '';

    constructor(symbols: Map<string, any>, projectRoot: string) {
        super(symbols);
        this.projectRooth = projectRoot;
    }

    override visit(node: ASTNode): string {
        switch (node.type) {
            case 'ENCENDER_BOT':
                return this.generateBotInit(node);
            case 'EVENTO_DISCORD':
                return this.generateDiscordEvent(node);
            case 'CREAR_MENSAJE':
                return this.generateMessage(node);
            case 'CREAR_EMBED':
                return this.generateEmbed(node);
            default:
                return super.visit(node);
        }
    }

    override generateAccess(node: any): string {
        const objName = node.object.type === 'IDENTIFICADOR' ? node.object.value : null;
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

    override generateCall(node: any): string {
        if (node.value.type === 'IDENTIFICADOR') {
            const name = node.value.value;
            
            if (typeof corelib[name] === 'string') {
                const translation = corelib[name] as string;
                const args = node.children.map((arg: any) => this.visit(arg)).join(', ');
                return `${translation}(${args})`;
            }
        }

        return super.generateCall(node);
    }

    private generateBotInit(node: any): string {
        const prefixNode = node.object.children.find((p: any) => p.key === 'prefijo');
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

    public generateSeyfertConfig(node: any): string {
        const tokenNode = node.object.children.find((p: any) => p.key === 'token');
        const intentsNode = node.object.children.find((p: any) => p.key === 'intenciones');
        const token = tokenNode ? this.visit(tokenNode.value) : '""';
        
        let intents = "[]";

        
        if (intentsNode && intentsNode.value.type === 'LISTA') {
            const list = intentsNode.value.children.map((item: any) => {
                const val = item.value.replace(/"/g, '');
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

    private generateDiscordEvent(node: any): string {
        const eventName = eventsMap[node.value]?.name;
        if (!eventName) throw new Error(`El evento ${node.value} no existe`);

        const body = node.children
            .map((n: any) => "    " + this.visit(n) + ";")
            .join('\n');

        const eventBody: string = `
            import { createEvent, Embed } from 'seyfert';

            export default createEvent({
                data: { name: '${eventName}' },
                async run(${eventsMap[node.value].params.join(', ')}) {
                ${body}
                }
            });
        `;

        fs.writeFileSync(join(this.projectRooth, 'dist', 'events', `${eventName}.js`), eventBody, 'utf-8');

        return '';
    }

    private generateMessage(node: any): string {
        const channelNode = node.object.children.find((p: any) => p.key === 'canal');
        const channel: string | undefined = channelNode ? this.visit(channelNode.value) : undefined;
        const contentNode = node.object.children.find((p: any) => p.key === 'contenido');
        const content: string | undefined = contentNode ? this.visit(contentNode.value) : undefined;

        if (!channel) throw new Error(`No se ha especificado el canal.`);
        return `cliente.messages.write(${channel}, { content: ${content} });`;
    }

    private generateEmbed(node: any): string {
        const channelNode = node.children.find((p: any) => p.type.toLowerCase() === 'canal');
        const channel: string | undefined = channelNode ? this.visit(channelNode.object) : undefined;
        const descriptionNode = node.children.find((p: any) => p.type.toLowerCase() === 'descripcion');
        const description: string | undefined = descriptionNode ? this.visit(descriptionNode.object) : undefined;
        const colorNode = node.children.find((p: any) => p.type.toLowerCase() === 'color');
        const color: string | undefined = colorNode ? this.visit(colorNode.object) : undefined;

        if (!channel) throw new Error(`No se ha especificado el canal.`);
        return `
            cliente.messages.write(${channel}, {
                embeds: [
                    new Embed()
                        ${description? `.setDescription(${description})` : ''}
                        ${color? `.setColor(${Object.keys(EmbedColors).includes(color.slice(1, -1))? `"${EmbedColors[color.slice(1, -1)]}"` : color})` : ''}
                ]
            });
        `;
    }
}