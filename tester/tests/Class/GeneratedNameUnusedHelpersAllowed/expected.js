import './lib/consoleRuntime.js';
let createChannel = 5;
let banMember = 6;

import { Command, IgnoreCommand, Embed, ActionRow, Button, createStringOption } from 'seyfert';

export default class HolaCommand extends Command {
    name = 'hola';
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
        const canal = contexto.interaction
            ? contexto.interaction.channel
            : await cliente.channels.fetch(contexto.channelId);
        const ctx = { cliente, contexto };

        console.log(createChannel + banMember);
    }
}
