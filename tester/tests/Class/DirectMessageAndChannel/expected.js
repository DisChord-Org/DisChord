import { createMessage } from './lib/createMessage.js';
let msg = await createMessage('111', { content: 'hola' }, null, ctx, '222');
