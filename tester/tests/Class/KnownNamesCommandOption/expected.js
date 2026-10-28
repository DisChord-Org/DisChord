import './lib/consoleRuntime.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'texto1',
        description: 'un texto',
        required: true,
        type: 3,
    },
];

export default class PruebaCommand extends Command {
    name = 'prueba';
    description = 'prueba';
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

        const { texto1 } = contexto.options;

        console.log(texto1);
    }
}
