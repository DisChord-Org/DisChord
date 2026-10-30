import './lib/userExtensions.js';
import './lib/consoleRuntime.js';
function f(u) {
    return u.nombre;
}

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        console.log(f(usuario));
    },
});
