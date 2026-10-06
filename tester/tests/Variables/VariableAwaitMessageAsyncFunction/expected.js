import { createMessage } from './lib/createMessage.js';
async function f() {
    await createMessage(undefined, { content: 'hola' }, null, ctx);
}
