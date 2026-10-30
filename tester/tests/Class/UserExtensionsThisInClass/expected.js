import './lib/consoleRuntime.js';
class Animal {
    constructor(nombre) {
        this.nombre = nombre;
    }

    hablar() {
        console.log(this.nombre);
    }
}

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        console.log('hola');
    },
});
