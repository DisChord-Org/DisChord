import './lib/userExtensions.js';
import { banMember } from './lib/moderation.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'objetivo',
        description: 'a quien',
        required: true,
        type: 6,
    },
];

export default class CastigaCommand extends Command {
    name = 'castiga';
    description = 'castiga';
    nsfw = false;
    integrationTypes = [0];
    contexts = [0];
    guildId = undefined;
    ignore = undefined;
    aliases = undefined;

    options = options;

    async run(contexto) {
        const cliente = contexto.client;
        const usuario = contexto.author;
        const canal = contexto.interaction ? contexto.interaction.channel : cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        const { objetivo } = contexto.options;

        await banMember(ctx, objetivo, contexto.guildId, 'spam', 3600);
    }
}
