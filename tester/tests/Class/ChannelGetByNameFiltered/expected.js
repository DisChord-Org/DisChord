import './lib/channelExtensions.js';
import { getChannel } from './lib/channels.js';
import './lib/consoleRuntime.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class CanalesCommand extends Command {
    name = 'canales';
    description = 'gestiona canales';
    nsfw = false;
    integrationTypes = [0];
    contexts = [0];
    guildId = undefined;
    ignore = undefined;
    aliases = undefined;

    async run(contexto) {
        const cliente = contexto.client;
        const usuario = contexto.author;
        const canal = contexto.interaction
            ? contexto.interaction.channel
            : await cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        let c = await getChannel(ctx, undefined, contexto.guildId, 'general', { type: 0, parent_id: '9' });
        console.log(c.nombre);
    }
}
