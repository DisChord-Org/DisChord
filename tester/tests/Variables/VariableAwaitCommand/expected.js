async function tarea() {
    return 1;
}

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class UnoCommand extends Command {
    name = 'uno';
    description = 'uno';
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

        await tarea();
    }
}
