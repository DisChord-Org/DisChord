import { Generator } from "../chord/generator";
import { ASTNode } from "../chord/types";

const INTENT_MAP: Record<string, string> = {
    "Servidores": "GatewayIntentBits.Guilds",
    "Mensajes": "GatewayIntentBits.GuildMessages",
    "ContenidoMensajes": "GatewayIntentBits.MessageContent",
    "Miembros": "GatewayIntentBits.GuildMembers",
};

export class DisChordGenerator extends Generator {
    private botConfig: any = null;

    constructor(symbols: Map<string, any>) {
        super(symbols);
    }

    override visit(node: ASTNode): string {
        switch (node.type) {
            case 'ENCENDER_BOT':
                this.botConfig = node.object?.children;
                return this.generateBotInit(node);
            case 'EVENTO_DISCORD':
                return this.generateDiscordEvent(node);
            default:
                return super.visit(node);
        }
    }

    private generateBotInit(node: any): string {
        console.log(node.object.children);
        const prefixNode = node.object.children.find((p: any) => p.key === 'prefijo');
        const prefix = prefixNode ? this.visit(prefixNode.value) : '"!"';

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

    public generateSeyfertConfig(): string {
        if (!this.botConfig) return "";

        const tokenNode = this.botConfig.children.find((p: any) => p.key === '"token"' || p.key === 'token');
        const intentsNode = this.botConfig.children.find((p: any) => p.key === '"intenciones"' || p.key === 'intenciones');
        
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