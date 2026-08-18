import './lib/userExtensions.js';
import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

const options = [
    {
        name: 'mencion',
        description: 'El usuario cuyo avatar quieres ver',
        required: true,
        type: 6,
    },
];

export default class AvatarCommand extends Command {
    name = 'avatar';
    description = 'Obtener el avatar de un usuario';
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

        const { mencion } = contexto.options;

        let AvatarEmbed = new Embed()
            .setColor(mencion.colorPerfil)
            .setTitle('Avatar de ' + mencion.nombre)

            .setImage(mencion.avatarUrl);

        await createMessage(undefined, { content: undefined, embeds: [AvatarEmbed] }, null, ctx);
    }
}
