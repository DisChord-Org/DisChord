import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'señal',
        description: 'Una opcion',
        required: true,
        type: 3,
    },
];

export default class pruebaCommand extends Command {
    name = 'prueba';
    description = 'Test';
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

        const { señal } = contexto.options;

        await createMessage(undefined, { content: señal }, null, ctx);
    }
}
