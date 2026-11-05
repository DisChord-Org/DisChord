import './lib/messageExtensions.js';
import { kickMember } from './lib/moderation.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'messageCreate' },
    async run(mensaje, cliente) {
        const ctx = { mensaje, cliente };
        await kickMember(ctx, mensaje.autor, mensaje.guildId, 'spam');
    },
});
