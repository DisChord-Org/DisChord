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
        const canal = contexto.interaction ? contexto.interaction.channel : cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        let todos = await listChannels(ctx, '1', {});
        console.log(todos);
    }
}
