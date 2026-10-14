import './lib/channelExtensions.js';
import { createChannel } from './lib/channels.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        await createChannel(ctx, '123456789', { name: 'inicio' });
    },
});
