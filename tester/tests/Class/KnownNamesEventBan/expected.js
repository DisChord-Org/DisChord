import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'guildBanAdd' },
    async run(miembro, cliente) {
        const ctx = { cliente };
        console.log(miembro);
        console.log(cliente);
    },
});
