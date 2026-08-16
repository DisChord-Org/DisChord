import { createMessage } from './lib/createMessage.js';
let Bienvenida = new Embed()

    .setTitle('Bienvenido')

    .setDescription('Gracias por unirte');

let msg = await createMessage(undefined, { content: undefined, embeds: [Bienvenida] }, null, ctx);
