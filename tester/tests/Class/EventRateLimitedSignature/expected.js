import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'rateLimited' },
    async run(ratelimit, cliente) {
        const ctx = { cliente };
        console.log(ratelimit);
        console.log(cliente.me.username);
    },
});
