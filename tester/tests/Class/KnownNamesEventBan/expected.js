import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'guildBanAdd' },
    async run({ user: usuario, guildId: servidorId }, cliente) {
        const ctx = { cliente };
        console.log(usuario);
        console.log(cliente);
    },
});
