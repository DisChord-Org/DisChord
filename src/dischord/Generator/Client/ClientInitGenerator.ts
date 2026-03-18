import { join } from "node:path";
import fs from "fs";

import { ASTNode, ObjectPropertyType } from "../../../chord/types";
import { StartBotNode } from "../../types";
import { DisChordGenerator } from "../generator";
import { intentsMap } from "../../core.lib";

export default class ClietInitGenerator {
    constructor (private ctx: DisChordGenerator) {}

    generate (node: StartBotNode): string {
        if (node.object.type != 'Objeto') throw new Error(`Se encontró '${node.object.type}', se esperaba 'Objeto'`);

        const prefixNode = node.object.properties.find((p: ObjectPropertyType) => p.key === 'prefijo');
        const prefix = prefixNode ? this.ctx.visit(prefixNode.value) : '"!"';

        const seyfertConfig = this.generateSeyfertConfig(node);
        fs.writeFileSync(join(this.ctx.projectRooth, 'seyfert.config.mjs'), seyfertConfig, 'utf-8');

        if (!fs.existsSync(join(this.ctx.projectRooth, 'dist', 'commands'))) fs.mkdirSync(join(this.ctx.projectRooth, 'dist', 'commands'), { recursive: true });
        if (!fs.existsSync(join(this.ctx.projectRooth, 'dist', 'events'))) fs.mkdirSync(join(this.ctx.projectRooth, 'dist', 'events'), { recursive: true });
        if (!fs.existsSync(join(this.ctx.projectRooth, 'dist', 'components'))) fs.mkdirSync(join(this.ctx.projectRooth, 'dist', 'components'), { recursive: true });

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

    private generateSeyfertConfig(node: StartBotNode): string {
        if (node.object.type != 'Objeto') throw new Error(`Se encontró '${node.object.type}', se esperaba 'Objeto'`);
        const tokenNode = node.object.properties.find((property: ObjectPropertyType) => property.key === 'token');
        const intentsNode = node.object.properties.find((property: ObjectPropertyType) => property.key === 'intenciones');
        const token = tokenNode ? this.ctx.visit(tokenNode.value) : '""';
        
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
}