import './lib/userExtensions.js';
import './lib/consoleRuntime.js';
function saluda(u) {
    console.log(u.nombre);
}

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        saluda(usuario);
    },
});
