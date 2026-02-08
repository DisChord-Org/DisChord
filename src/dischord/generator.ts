import fs from "node:fs";
import { Generator } from "../chord/generator";
import { ASTNode } from "../chord/types";
import { join } from "node:path";
import { corelib } from "./core.lib";

const INTENT_MAP: Record<string, string> = {
    "Servidores": "GatewayIntentBits.Guilds",
    "Mensajes": "GatewayIntentBits.GuildMessages",
    "ContenidoMensajes": "GatewayIntentBits.MessageContent",
    "Miembros": "GatewayIntentBits.GuildMembers",
};

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
                return INTENT_MAP[val] || "GatewayIntentBits.Guilds";
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
        const eventMap: Record<string, any> = {
            'encendido': {
                "name": 'ready',
                "params": [ 'usuario', 'cliente' ]
            },
            // 'mensaje': 'messageCreate',
            // 'interaccion': 'interactionCreate'
        };

        const eventName = eventMap[node.value]?.name;
        if (!eventName) throw new Error(`El evento ${node.value} no existe`);

        const body = node.children
            .map((n: any) => "    " + this.visit(n) + ";")
            .join('\n');

        const eventBody: string = `
            import { createEvent } from 'seyfert';

            export default createEvent({
                data: { name: '${eventName}' },
                async run(${eventMap[node.value].params.join(', ')}) {
                ${body}
                }
            });
        `;

        fs.writeFileSync(join(this.projectRooth, 'dist', 'events', `${eventName}.js`), eventBody, 'utf-8');

        return '';
    }
}