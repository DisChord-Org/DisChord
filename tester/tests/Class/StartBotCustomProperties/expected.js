import './lib/messageExtensions.js';
import './lib/userExtensions.js';
async function cargarDatos() {
    return 5;
}

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

client['version'] = '1.0';
client['contador'] = 0;
client['cargado'] = await cargarDatos();

client.start().then(async () => {});

process.on('unhandledRejection', async (err) => {
    console.error(err);
});
