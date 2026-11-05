import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'guildDelete' },
    async run(servidor, cliente) {
        if (servidor.unavailable) return;
        const servidorId = servidor.id;
        const ctx = { cliente };
        console.log(servidorId);
    },
});
