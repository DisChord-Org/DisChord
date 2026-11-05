import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'guildRoleUpdate' },
    async run([rol, rolAnterior], cliente) {
        const ctx = { cliente };
        console.log(rol.id);
        console.log(rolAnterior);
    },
});
