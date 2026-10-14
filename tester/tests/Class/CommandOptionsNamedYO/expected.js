import './lib/consoleRuntime.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'x',
        description: 'x',
        required: true,
        type: 10,
    },
    {
        name: 'y',
        description: 'y',
        required: true,
        type: 10,
    },
    {
        name: 'o',
        description: 'o',
        required: true,
        type: 10,
    },
];

export default class PuntoCommand extends Command {
    name = 'punto';
    description = 'punto';
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

        const { x, y, o } = contexto.options;

        console.log(x);
    }
}
