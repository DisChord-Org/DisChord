import './lib/consoleRuntime.js';
function f(usuario) {
    return usuario;
}

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        console.log(f(1));
    },
});
