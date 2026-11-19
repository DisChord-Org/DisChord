import { createMessage } from './lib/createMessage.js';
let Hola = new Embed().setTitle('a');

let n = 5;

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'nota',
        description: 'una nota',
        required: false,
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
        const canal = contexto.interaction
            ? contexto.interaction.channel
            : await cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        const { nota } = contexto.options;

        let c = '#ff0000';
        let n = 'local';
        let crudo = { title: 'sin traducir' };
        await createMessage(
            undefined,
            {
                content: 'n vale ' + n,
                embeds: [
                    Hola,
                    crudo,
                    new Embed()
                        .setColor(c)
                        .setTitle('' + c)

                        .setDescription(n),
                    new Embed()
                        .setColor(255)

                        .setDescription(nota),
                    new Embed()
                        .setColor('Green')

                        .setAuthor({ text: usuario.username, iconUrl: undefined })

                        .setTimestamp(),
                ],
            },
            null,
            ctx,
        );
    }
}
