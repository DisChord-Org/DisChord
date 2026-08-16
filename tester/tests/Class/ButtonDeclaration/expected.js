import { createMessage } from './lib/createMessage.js';
let Confirmar = new Button().setCustomId('confirmar').setLabel('Confirmar').setStyle(3);

let msg = await createMessage(
    undefined,
    { content: 'hola', components: [new ActionRow().setComponents([Confirmar])] },
    null,
    ctx,
);
