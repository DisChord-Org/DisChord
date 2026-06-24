import { join } from "node:path";
import fs from "fs";
import Prettifier from "../../../../init/Prettifier";

import { DisChordNode, DisChordNodeType, DisChordTokenType, StartBotNode } from "../../../types";
import { DisChordGenerator } from "../../Generator";
import { intentsMap } from "../../../core.lib";
import { SubGenerator } from "../../../../chord/Generator/SubGenerator";
import { DisChordError, ErrorLevel } from "../../../../ChordError";
import { TokenTypeUnion } from "../../../../chord/types";

/**
 * Generator class responsible for generating code related to starting the bot and setting up the client in DisChrod.
 */
export default class ClietInitVisitor extends SubGenerator<DisChordNodeType, DisChordNode> {
    /**
     * The node type string that triggers the activation of this specific sub-generator.
     * @public
     * @static
     */
    public static triggerToken: TokenTypeUnion<DisChordTokenType> | undefined = DisChordTokenType.ENCENDER_BOT;
    
    /**
     * Generates code for a StartBotNode, which represents the initialization of the bot in DisChord.
     * It extracts the necessary configuration from the node, generates a Seyfert configuration file, and returns the code to start the client.
     * @param node The StartBotNode representing the bot initialization to generate code for.
     * @returns The generated code for starting the bot.
     */
    visit (node: StartBotNode): string {
        if (node.object.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se encontró '${node.object.type}', se esperaba 'Objeto'`,
            location: node.location
        }).format();

        const { blocks } = node.object;
        const prefixNode = blocks['prefijo'] || blocks['prefijos'];

        if (!prefixNode) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `No se ha especificado el prefijo en el bloque 'encender bot'`,
            location: node.location
        }).format();

        const prefix = this.parent.visit(prefixNode);
        const isArray = prefixNode.type === 'Lista';

        let includeSlash = false;
        if (isArray) {
            includeSlash = prefixNode.body.some(
                (p) => p.type === 'Literal' && p.value === '/'
            );
        } else if (prefixNode.type === 'Literal') {
            includeSlash = prefixNode.value === '/';
        }

        const seyfertConfig = this.generateSeyfertConfig(node);
        Prettifier.savePrettified(join(this.parent.context.projectRoot, 'seyfert.config.mjs'), seyfertConfig)

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
        if (node.object.type != 'BDO') throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Se encontró '${node.object.type}', se esperaba 'BDO'`,
            location: node.location
        }).format();

        const { blocks } = node.object;
        const tokenNode = blocks['token'];
        const intentsNode = blocks['intenciones'];

        if (!tokenNode) throw new DisChordError({
            phase: ErrorLevel.Compiler,
            message: `Falta el bloque 'token' en la configuración del bot.`,
            location: node.location
        }).format();
        
        const token = this.parent.visit(tokenNode);
        let intents = "[]";
        
        if (intentsNode && intentsNode.type === 'Lista') {
            const list = intentsNode.body.map((item: any) => {
                const val = item.value?.toString().replace(/"/g, '');
                const mapped = intentsMap[val];
                if (!mapped) throw new DisChordError({
                    phase: ErrorLevel.Compiler,
                    message: `Intención desconocida: ${val}`,
                    location: node.location
                }).format();
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
            const path = join(this.parent.context.projectRoot, 'dist', dir);
            if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        });
    }
}