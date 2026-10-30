import './lib/userExtensions.js';

import { Client } from 'seyfert';
const client = new Client({
    commands: {
        prefix: () => ['!'],
        reply: () => true,
    },
});

client.setServices({
    cache: {
        disabledCache: { bans: true, emojis: true, stickers: true, roles: true, presences: true },
    },
});

client.start().then(async () => {});

process.on('unhandledRejection', async (err) => {
    console.error(err);
});
