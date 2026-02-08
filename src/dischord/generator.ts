import fs from "node:fs";
import { Generator } from "../chord/generator";
import { ASTNode } from "../chord/types";
import { join } from "node:path";

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
        const eventMap: Record<string, string> = {
            'encendido': 'botReady',
            'mensaje': 'messageCreate',
            'interaccion': 'interactionCreate'
        };

        const eventName = eventMap[node.nombre] || node.nombre;
        
        const body = node.children
            .map((n: any) => "    " + this.visit(n) + ";")
            .join('\n');

        return `client.on('${eventName}', async (context) => {\n${body}\n});`;
    }
}