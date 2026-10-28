import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'channelCreate' },
    async run(canal, cliente) {
        const ctx = { cliente };
        console.log(canal);
        console.log(cliente);
    },
});
