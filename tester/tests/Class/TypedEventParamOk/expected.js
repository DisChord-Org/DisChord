import './lib/userExtensions.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'guildMemberAdd' },
    async run(miembro, cliente) {
        const ctx = { cliente };
        let n = miembro.nombre;
    },
});
