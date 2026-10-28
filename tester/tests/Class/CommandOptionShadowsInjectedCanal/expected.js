import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'canal',
        description: 'un valor',
        required: true,
        type: 3,
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
        const usuario = contexto.author;
        const ctx = { cliente, contexto };

        const { canal } = contexto.options;

        await createMessage(undefined, { content: 'hola ' + canal }, null, ctx);
    }
}
