import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'messageUpdate' },
    async run([mensaje, mensajeAnterior], cliente) {
        const ctx = { mensaje, cliente };
        console.log(mensaje.id);
        console.log(mensajeAnterior);
    },
});
