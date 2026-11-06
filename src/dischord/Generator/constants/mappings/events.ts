import { ChannelAction, ModerationAction } from "../../../types";
import { dictionary } from "./dictionary";

/**
 * A parameter of an event handler: a name; several names taken from the array Seyfert passes as
 * that argument (`messageUpdate` gives `[new, old]`), which the handler destructures; or names taken
 * from the fields of the object it passes (`guildBanAdd` gives `{ guildId, user }`): each field with
 * the name it has in the handler.
 */
export type EventParam = string | { readonly destructure: readonly string[] } | { readonly fields: Readonly<Record<string, string>> };

/**
 * @interface EventType
 * @property {string} name - The internal or low-level Discord event name.
 * @property {EventParam[]} params - The parameters of the event handler callback, in the order Seyfert passes its arguments.
 * @property {string} [guard] - A condition under which the handler returns before running the program (`servidor.unavailable`): the events it is no use to.
 * @property {Record<string, string>} [derived] - Names the handler declares from its parameters, each with the expression it is initialized with (`servidorId` of `servidor.id`).
 */
export interface EventType {
    name: string;
    params: EventParam[];
    guard?: string;
    derived?: Record<string, string>;
}

/**
 * @param {EventType} event - An entry of `eventsMap`.
 * @returns {string[]} The names its handler finds in scope: its parameters, the destructured ones in place, and the ones it derives from them.
 */
export function eventParamNames (event: EventType): string[] {
    return [ ...event.params.flatMap(param => {
        if (typeof param === 'string') return [ param ];

        return 'destructure' in param ? [ ...param.destructure ] : Object.values(param.fields);
    }), ...Object.keys(event.derived ?? {}) ];
}

/**
 * @param {EventType} event - An entry of `eventsMap`.
 * @returns {string} The parameter list of its handler as written in the generated code (`[mensaje, mensajeAnterior], cliente`).
 */
export function eventParamSignature (event: EventType): string {
    return event.params.map(param => {
        if (typeof param === 'string') return param;

        return 'destructure' in param
            ? `[${param.destructure.join(', ')}]`
            : `{ ${Object.entries(param.fields).map(([ field, name ]) => field === name ? field : `${field}: ${name}`).join(', ')} }`;
    }).join(', ');
}

/** The `{ user, guildId }` object Seyfert passes to the ban and member-removal events. */
const guildUserFields: EventParam = { fields: { user: 'usuario', guildId: 'servidorId' } };

/**
 * Map translating DisChord Spanish event identifiers to their corresponding internal Discord event structures.
 *
 * @type {Readonly<Record<string, EventType>>}
 */
export const eventsMap: Readonly<Record<string, EventType>> = dictionary({
    'encendido': {
        'name': 'ready',
        'params': [ 'usuario', 'cliente' ]
    },
    'mensajeCreado': {
        'name': 'messageCreate',
        'params': [ 'mensaje', 'cliente' ]
    },
    'mensajeBorrado': {
        'name': 'messageDelete',
        'params': [ 'mensaje', 'cliente' ]
    },
    'mensajeEditado': {
        'name': 'messageUpdate',
        'params': [ { destructure: [ 'mensaje', 'mensajeAnterior' ] }, 'cliente' ]
    },
    'canalCreado': {
        'name': 'channelCreate',
        'params': [ 'canal', 'cliente' ]
    },
    'canalBorrado': {
        'name': 'channelDelete',
        'params': [ 'canal', 'cliente' ]
    },
    'canalEditado': {
        'name': 'channelUpdate',
        'params': [ { destructure: [ 'canal', 'canalAnterior' ] }, 'cliente' ]
    },
    'usuarioBaneado': {
        'name': 'guildBanAdd',
        'params': [ guildUserFields, 'cliente' ]
    },
    'usuarioDesbaneado': {
        'name': 'guildBanRemove',
        'params': [ guildUserFields, 'cliente' ]
    },
    'invitado': {
        'name': 'guildCreate',
        'params': [ 'servidor', 'cliente' ]
    },
    'expulsado': {
        'name': 'guildDelete',
        'params': [ 'servidor', 'cliente' ],
        'guard': 'servidor.unavailable',
        'derived': { 'servidorId': 'servidor.id' }
    },
    'entradaMiembro': {
        'name': 'guildMemberAdd',
        'params': [ 'miembro', 'cliente' ]
    },
    'idaMiembro': {
        'name': 'guildMemberRemove',
        'params': [ guildUserFields, 'cliente' ]
    },
    'rolCreado': {
        'name': 'guildRoleCreate',
        'params': [ 'rol', 'cliente' ]
    },
    'rolBorrado': {
        'name': 'guildRoleDelete',
        'params': [ 'rol', 'cliente' ]
    },
    'rolEditado': {
        'name': 'guildRoleUpdate',
        'params': [ { destructure: [ 'rol', 'rolAnterior' ] }, 'cliente' ]
    },
    'limitado': {
        'name': 'rateLimited',
        'params': [ 'ratelimit', 'cliente' ]
    },
    'interaccion': {
        'name': 'interactionCreate',
        'params': [ 'interaccion', 'cliente' ]
    }
} as const);

/**
 * The events that were renamed, by their old name, so that using one says what it is called now.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const RenamedEvents: Readonly<Record<string, string>> = dictionary({
    "ban": "usuarioBaneado",
    "unban": "usuarioDesbaneado"
} as const);

/**
 * Where an event's parameter holds the id of the server the event happened in, by parameter name.
 * The first parameter of an event found here gives the server a channel action defaults to; an
 * event with none (`encendido`, `limitado`) has no server to default to.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const EventGuildSources: Readonly<Record<string, string>> = dictionary({
    "mensaje": "mensaje.guildId",
    "canal": "canal.guildId",
    "miembro": "miembro.guildId",
    "rol": "rol.guildId",
    "servidor": "servidor.id",
    "servidorId": "servidorId",
    "interaccion": "interaccion.guildId"
} as const);

/**
 * The actions each event can be set off by, and that it must therefore not perform. An event that
 * performs one would trigger itself over and over, so the analyzer rejects it there: a channel
 * action in its own channel event, and the pairs of moderation events that undo each other (`desbanear`
 * in `usuarioBaneado` bans again, and the other way round; `expulsar` in `entradaMiembro` kicks whoever just joined).
 *
 * @type {Readonly<Record<string, readonly (ChannelAction | ModerationAction)[]>>}
 */
export const EventSelfTriggers: Readonly<Record<string, readonly (ChannelAction | ModerationAction)[]>> = dictionary({
    "canalCreado": [ ChannelAction.Crear ],
    "canalEditado": [ ChannelAction.Editar ],
    "canalBorrado": [ ChannelAction.Borrar ],
    "usuarioBaneado": [ ModerationAction.Desbanear ],
    "usuarioDesbaneado": [ ModerationAction.Banear ],
    "entradaMiembro": [ ModerationAction.Expulsar ]
} as const);

/**
 * The server the event of that name carries, as the expression its handler reads it from: the one of
 * the first parameter that has a source (`EventGuildSources`).
 * @param {string} eventName - The name of an event, as written.
 * @returns {string | undefined} The expression, or `undefined` if the event carries no server.
 */
export function eventGuildSource (eventName: string): string | undefined {
    const event = eventsMap[eventName];
    const source = (event ? eventParamNames(event) : []).find(param => EventGuildSources[param] !== undefined);

    return source === undefined ? undefined : EventGuildSources[source];
}
