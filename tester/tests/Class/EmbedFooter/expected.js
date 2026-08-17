import { createMessage } from './lib/createMessage.js';
await createMessage(
    undefined,
    {
        content: undefined,
        embeds: [new Embed().setFooter({ text: 'DisChord Bot v1.0', iconUrl: 'https://ejemplo.com/logo.png' })],
    },
    null,
    ctx,
);
