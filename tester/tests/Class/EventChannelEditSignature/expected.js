import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'channelUpdate' },
    async run([canal, canalAnterior], cliente) {
        const ctx = { cliente };
        console.log(canal.id);
        console.log(canalAnterior);
    },
});
