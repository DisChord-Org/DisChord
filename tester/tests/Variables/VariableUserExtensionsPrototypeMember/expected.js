import { createEvent, Embed, ActionRow, Button } from 'seyfert';

export default createEvent({
    data: { name: 'ready' },
    async run(usuario, cliente) {
        const ctx = { cliente };
        let a = usuario.constructor;
        let b = usuario.toString;
        let c = usuario.hasOwnProperty;
        cliente.logger.info(a);
        cliente.logger.info(b);
        cliente.logger.info(c);
    },
});
