import './lib/userExtensions.js';
import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        (typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info(
            usuario.nombre,
        );
    },
});
