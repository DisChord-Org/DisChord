import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class XCommand extends Command {
    name = 'x';
    description = 'x';
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

        let msg = await createMessage(undefined, { content: 'hola' }, null, ctx);

        let collector = msg.createComponentCollector({
            filter: (interaccion) => interaccion.user.id === contexto.author.id,
            idle: 60000,
        });
    }
}
