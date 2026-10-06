import { createMessage } from './lib/createMessage.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'messageCreate' },
    async run(mensaje, cliente) {
        const ctx = { mensaje, cliente };
        await createMessage(canal, { content: 'hola' }, null, ctx);
    },
});
