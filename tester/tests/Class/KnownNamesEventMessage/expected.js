import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'messageCreate' },
    async run(mensaje, cliente) {
        const ctx = { mensaje, cliente };
        console.log(cliente);
    },
});
