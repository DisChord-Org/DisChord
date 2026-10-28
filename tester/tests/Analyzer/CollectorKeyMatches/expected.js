import { createMessage } from './lib/createMessage.js';
import './lib/consoleRuntime.js';
function alPulsar(interaccion, cliente) {
    (typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info('pulsado');
}

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

        let msg = await createMessage(
            undefined,
            {
                content: 'hola',
                components: [
                    new ActionRow().setComponents([
                        new Button().setCustomId('aceptar').setLabel('Aceptar').setStyle(3),
                    ]),
                ],
            },
            null,
            ctx,
        );

        let collector = msg.createComponentCollector({
            filter: (interaccion) => interaccion.user.id === contexto.author.id,
            idle: 60000,
        });

        collector.run('aceptar', (interaccion) => alPulsar(interaccion, cliente, contexto));
    }
}
