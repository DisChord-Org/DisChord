import { createMessage } from './lib/createMessage.js';
let Bienvenida = new Embed().setTitle('Bienvenido');

let msg = await createMessage(
    undefined,
    { content: 'hola', embeds: [new Embed().setTitle('Uno'), new Embed().setTitle('Dos'), Bienvenida] },
    null,
    ctx,
);
