import { createMessage } from './lib/createMessage.js';
function soloAutor(interaccion, cliente, contexto) {
    return interaccion.user.id === contexto.author.id;
}
function cuandoTermine(razon, reiniciar, cliente, contexto) {
    cliente.logger.info('El recolector terminó: ' + razon);
}
function alPulsarMiId(interaccion, cliente, contexto) {
    cliente.logger.info('Se ha pulsado el boton con id miid');
}

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
                content: 'hola',
                components: [
                    new ActionRow().setComponents([new Button().setCustomId('miid').setLabel('mi boton').setStyle(1)]),
                ],
            },
            null,
            ctx,
        );

        let collector = msg.createComponentCollector({
            filter: (interaccion) => soloAutor(interaccion, cliente, contexto),
            idle: 30000,
            onStop: (razon, reiniciar) => cuandoTermine(razon, reiniciar, cliente, contexto),
        });

        collector.run('miid', (interaccion) => alPulsarMiId(interaccion, cliente, contexto));
    }
}
