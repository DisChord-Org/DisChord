import './lib/userExtensions.js';
import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'usuario',
        description: 'a quien saludar',
        required: true,
        type: 6,
    },
];

export default class SaludaCommand extends Command {
    name = 'saluda';
    description = 'saluda';
    nsfw = false;
    integrationTypes = [0];
    contexts = [0];
    guildId = undefined;
    ignore = undefined;
    aliases = undefined;

    options = options;

    async run(contexto) {
        const cliente = contexto.client;
        const canal = contexto.interaction ? contexto.interaction.channel : cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        const { usuario } = contexto.options;

        await createMessage(undefined, { content: 'hola ' + usuario }, null, ctx);
    }
}
