import { createMessage } from './lib/createMessage.mjs';
let msg = await createMessage(
    undefined,
    {
        content: 'hola',
        components: [
            new ActionRow().setComponents([
                new Button().setCustomId('1').setLabel('1').setStyle(3),
                new Button().setCustomId('2').setLabel('2').setStyle(3),
                new Button().setCustomId('3').setLabel('3').setStyle(3),
                new Button().setCustomId('4').setLabel('4').setStyle(3),
                new Button().setCustomId('5').setLabel('5').setStyle(3),
            ]),
            new ActionRow().setComponents([
                new Button().setCustomId('6').setLabel('6').setStyle(3),
                new Button().setCustomId('7').setLabel('7').setStyle(3),
            ]),
        ],
    },
    null,
    ctx,
);
