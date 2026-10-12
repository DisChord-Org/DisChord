import { createChannel } from './lib/channels.js';

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
        const canal = contexto.interaction ? contexto.interaction.channel : cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        let c = await createChannel(ctx, contexto.guildId, {
            name: 'avisos',
            type: 2,
            topic: 'Novedades',
            nsfw: false,
            parent_id: '123',
            rate_limit_per_user: 5,
        });
    }
}
