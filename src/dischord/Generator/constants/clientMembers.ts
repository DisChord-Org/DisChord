/**
 * Names `cliente` already has, so a custom property of `encender bot` can't use one: assigning it
 * would overwrite something Seyfert (or the language) relies on. Written by hand from Seyfert's
 * `Client`, not read from it, so a member Seyfert adds later is not here until it is added.
 */
export const reservedClientMembers: ReadonlySet<string> = new Set([
    // What the language offers on `cliente` (`corelib/classes/cliente.ts`)
    'id', 'nombre', 'avatar', 'avatarUrl', 'ping', 'emitir',
    // Seyfert's client: managers, services and state
    'rest', 'cache', 'gateway', 'proxy', 'events', 'commands', 'components', 'langs', 'logger',
    'middlewares', 'options', 'me', 'botId', 'applicationId', 'collectors', 'debugger',
    'users', 'guilds', 'channels', 'messages', 'members', 'roles', 'emojis', 'stickers', 'threads',
    'bans', 'reactions', 'interactions', 'webhooks', 'templates', 'voiceStates', 'invites',
    'applications', 'soundboards', 'memberUpdateHandler', 'presenceUpdateHandler',
    'workerData', 'shards', 'handleCommand', 'handlers',
    // Seyfert's client: methods
    'start', 'stop', 'setServices', 'uploadCommands', 'loadCommands', 'loadEvents', 'loadComponents',
    'loadLangs', 'getRC', 'run', 'execute', 't', 'onPacket', 'onInteractionRequest',
    // JavaScript's own
    'constructor', 'prototype', '__proto__', 'toString', 'valueOf', 'hasOwnProperty'
]);
