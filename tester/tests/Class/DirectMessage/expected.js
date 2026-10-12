import { createMessage } from './lib/createMessage.js';
let msg = await createMessage(undefined, { content: 'hola' }, null, ctx, '123456789');
