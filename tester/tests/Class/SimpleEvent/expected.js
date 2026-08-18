import './lib/userExtensions.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        cliente.logger.info('[' + usuario.nombre + '] Bot Encendido');
    },
});
