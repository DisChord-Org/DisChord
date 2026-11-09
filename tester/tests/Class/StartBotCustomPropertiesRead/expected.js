import './lib/messageExtensions.js';
import './lib/userExtensions.js';
import './lib/consoleRuntime.js';

import { Client } from 'seyfert';
const client = new Client({
    commands: {
        prefix: () => ['!'],
        reply: () => true,
    },
});

client.setServices({
    cache: {
        disabledCache: { bans: true, emojis: true, stickers: true, roles: true, presences: true },
    },
});

client['version'] = '1.0';

client.start().then(async () => {});

process.on('unhandledRejection', async (err) => {
    console.error(err);
});
import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class PruebaCommand extends Command {
    name = 'prueba';
    description = 'prueba';
    nsfw = false;
    integrationTypes = [0];
    contexts = [0];
    guildId = undefined;
    ignore = undefined;
    aliases = undefined;

    async run(contexto) {
        const cliente = contexto.client;
        const usuario = contexto.author;
        const canal = contexto.interaction ? contexto.interaction.channel : cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        console.log(cliente.version);
        cliente.version = '2';
    }
}
