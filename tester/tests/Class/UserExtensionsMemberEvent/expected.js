import './lib/userExtensions.js';
import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'guildMemberAdd' },
    async run(miembro, cliente) {
        const ctx = { cliente };
        console.log(miembro.nombre);
    },
});
