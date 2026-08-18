import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class AvatarCommand extends Command {
    name = 'avatar';
    description = 'Obtener el avatar de un usuario';
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

        let AvatarEmbed = new Embed().setTitle('Avatar de ' + usuario.username);

        await createMessage(undefined, { content: undefined, embeds: [AvatarEmbed] }, null, ctx);
    }
}
