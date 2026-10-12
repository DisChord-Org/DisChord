import { createChannel } from './lib/channels.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'channelDelete' },
    async run(canal, cliente) {
        const ctx = { cliente };
        await createChannel(ctx, canal.guildId, { name: 'copia' });
    },
});
