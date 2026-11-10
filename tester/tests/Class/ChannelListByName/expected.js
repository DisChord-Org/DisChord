import './lib/channelExtensions.js';
import { listChannels } from './lib/channels.js';
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

        let iguales = await listChannels(ctx, contexto.guildId, { name: 'general' });
        let tickets = await listChannels(ctx, contexto.guildId, { type: 0, nameContains: 'ticket-' });
        console.log(iguales);
        console.log(tickets);
    }
}
