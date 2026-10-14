import './lib/consoleRuntime.js';

import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        let a = usuario.constructor;
        let b = usuario.toString;
        let c = usuario.hasOwnProperty;
        (typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info(a);
        (typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info(b);
        (typeof cliente !== 'undefined' && cliente.logger ? cliente.logger : { info: console.log }).info(c);
    },
});
