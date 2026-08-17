import { createMessage } from './lib/createMessage.js';

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class HolaMundoCommand extends Command {
    name = 'hola-mundo';
    description = 'un hola mundo desde DisChord';
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

        let msg = await createMessage(
            undefined,
            {
                content: undefined,
                components: [
                    new ActionRow().setComponents([
                        new Button().setCustomId('miid').setLabel('mi boton').setStyle(1).setEmoji('🔥'),
                    ]),
                ],
                embeds: [new Embed().setDescription('hola')],
            },
            null,
            ctx,
        );

        let collector = msg.createComponentCollector({
            filter: (interaccion) => interaccion.user.id === contexto.author.id,
            timeout: 60000,
        });

        collector.run('miid', async (interaccion) => {
            cliente.logger.info('Se ha pulsado el boton con id miid');
        });
    }
}
