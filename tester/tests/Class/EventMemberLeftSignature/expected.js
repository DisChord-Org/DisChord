import './lib/userExtensions.js';
import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'guildMemberRemove' },
    async run({ user: usuario, guildId: servidorId }, cliente) {
        const ctx = { cliente };
        console.log(usuario.nombre);
        console.log(servidorId);
    },
});
