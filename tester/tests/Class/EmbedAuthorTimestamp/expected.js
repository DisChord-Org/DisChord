import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class PruebaCommand extends Command {
    name = 'prueba';
    description = 'prueba';
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

        await createMessage(
            undefined,
            {
                content: undefined,
                embeds: [
                    new Embed()

                        .setTitle('Hola')
                        .setAuthor({ text: 'Yo', iconUrl: 'https://x.y/i.png' })

                        .setTimestamp(),
                ],
            },
            null,
            ctx,
        );
    }
}
new Embed()

    .setAuthor({ text: usuario.username, iconUrl: undefined })

    .setTimestamp();
