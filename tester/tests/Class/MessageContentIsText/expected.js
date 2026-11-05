import './lib/messageExtensions.js';
import './lib/userExtensions.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'messageCreate' },
    async run(mensaje, cliente) {
        const ctx = { mensaje, cliente };
        let t = mensaje.contenido;
        let autor = mensaje.autor.nombre;
    },
});
