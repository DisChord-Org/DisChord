import { join } from "node:path";
import fs from "fs";
import Prettifier from "../../../Prettifier";

import { ListNode, LiteralNode } from "../../../chord/types";
import { StartBotNode } from "../../types";
import { DisChordGenerator } from "../generator";
import { intentsMap } from "../../core.lib";
import { SubGenerator } from "../subgenerator";

/**
 * Generator class responsible for generating code related to starting the bot and setting up the client in DisChrod.
 */
export default class ClietInitGenerator extends SubGenerator {
    /** To identify when this generator should be used */
    static triggerToken: string = "EncenderBot";

    /**
     * Constructor for the ClientInitGenerator class.
     * @param parent The context of the DisChordGenerator.
     */
    constructor (protected parent: DisChordGenerator) {
        super(parent);
    }

    /**
     * Generates code for a StartBotNode, which represents the initialization of the bot in DisChord.
     * It extracts the necessary configuration from the node, generates a Seyfert configuration file, and returns the code to start the client.
     * @param node The StartBotNode representing the bot initialization to generate code for.
     * @returns The generated code for starting the bot.
     */
    generate (node: StartBotNode): string {
        if (node.object.type != 'BDO') throw new Error(`Se encontró '${node.object.type}', se esperaba 'Objeto'`);

        const { blocks } = node.object;
        const prefixNode = blocks['prefijo'] || blocks['prefijos'];
        if (!prefixNode) throw new Error("No se ha especificado el prefijo en el bloque 'encender bot'.");

        const prefix = this.visit(prefixNode);
        const isArray = prefixNode.type === 'Lista';

        let includeSlash = false;
        if (isArray) {
            includeSlash = (prefixNode as ListNode).body.some(
                (p: any) => p.type === 'Literal' && p.value === '/'
            );
        } else if (prefixNode.type === 'Literal') {
            includeSlash = (prefixNode as LiteralNode).value === '/';
        }

        const seyfertConfig = this.generateSeyfertConfig(node);
        Prettifier.savePrettified(join(this.parent.projectRoot, 'seyfert.config.mjs'), seyfertConfig)

        this.ensureDirectories();

        return `
            import { Client } from "seyfert";
            const client = new Client({
                commands: {
                    prefix: () => ${isArray ? prefix : `[${prefix}]`},
                    reply: () => true
                }
            });

            client.setServices({
                cache: {
                    disabledCache: { bans: true, emojis: true, stickers: true, roles: true, presences: true }
                }
            });

            client.start().then(async () => {
                ${includeSlash ? 'await client.uploadCommands().catch(error => console.log(error));' : ''}
            });

            process.on('unhandledRejection', async (err) => {
                console.error(err);
            });
        `;
    }

    /**
     * Generates the Seyfert configuration file content based on the provided StartBotNode.
     * @param node The StartBotNode containing the configuration for the bot, including the token and intents.
     * @returns The generated Seyfert configuration file content.
     */
    private generateSeyfertConfig(node: StartBotNode): string {
        if (node.object.type != 'BDO') throw new Error(`Se encontró '${node.object.type}', se esperaba 'BDO'`);

        const { blocks } = node.object;

        const tokenNode = blocks['token'];
        const intentsNode = blocks['intenciones'];

        if (!tokenNode) throw new Error("Falta el bloque 'token' en la configuración del bot.");
        
        const token = this.visit(tokenNode);
        let intents = "[]";
        
        if (intentsNode && intentsNode.type === 'Lista') {
            const list = (intentsNode as ListNode).body.map((item: any) => {
                const val = item.value?.toString().replace(/"/g, '');
                const mapped = intentsMap[val];
                if (!mapped) throw new Error(`Intención desconocida: ${val}`);
                return `"${mapped}"`;
            });
            intents = `[ ${list.join(',')} ]`;
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

    /**
     * Helper to ensure the output directories exist.
     */
    private ensureDirectories() {
        const dirs = ['commands', 'events', 'components'];
        dirs.forEach(dir => {
            const path = join(this.parent.projectRoot, 'dist', dir);
            if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        });
    }
}