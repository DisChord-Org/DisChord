import { PrimitiveTypeName } from "../../../chord/model/types";
import { ApplicationIntegrationType, ChannelAction, DiscordOptionType, IgnoreCommandType, InteractionContextType } from "../../types";

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
interface EventType {
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

/**
 * Builds a lookup table with no prototype, so a name written in the source (`constructor`,
 * `toString`...) is never found among the keys it inherits from `Object.prototype`.
 * @param entries - The table's own entries.
 */
function dictionary<V> (entries: Record<string, V>): Record<string, V> {
    return Object.assign(Object.create(null), entries);
}

/**
 * Name of the parameter of a command's handler: the interaction context Seyfert hands it.
 * @type {string}
 */
export const CommandContextParameter = 'contexto';

/**
 * What a command's body finds in scope besides its options and the handler's own parameter: each
 * name with the JavaScript expression it is initialized with, in the order they are declared
 * (later ones may use earlier ones). The generator emits these declarations and the vocabulary
 * tools list them from this one table.
 * @type {Readonly<Record<string, string>>}
 */
export const CommandScope: Readonly<Record<string, string>> = {
    cliente: 'contexto.client',
    usuario: 'contexto.author',
    canal: 'contexto.interaction ? contexto.interaction.channel : cliente.channels.fetch(contexto.channelId)',
    ctx: '{ cliente, contexto }'
};

/**
 * Map translating DisChord Spanish event identifiers to their corresponding internal Discord event structures.
 *
 * @type {Readonly<Record<string, EventType>>}
 */
export const eventsMap: Record<string, EventType> = dictionary({
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
        'params': [ { fields: { user: 'usuario', guildId: 'servidorId' } }, 'cliente' ]
    },
    'usuarioDesbaneado': {
        'name': 'guildBanRemove',
        'params': [ { fields: { user: 'usuario', guildId: 'servidorId' } }, 'cliente' ]
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
        'params': [ { fields: { user: 'usuario', guildId: 'servidorId' } }, 'cliente' ]
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
 * Map translating DisChord Gateway Intent aliases into standard Discord Gateway Intent flags.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const intentsMap: Record<string, string> = dictionary({
    'ConfiguracionDelAutomoderador': 'AutoModeratorConfiguration',
    'EjecucionDelAutomoderador': 'AutoModerationExecution',
    'EncuestasPorPrivado': 'DirectMessagePolls',
    'ReaccionesPorPrivado': 'DirectMessageReactions',
    'EscribiendoPorPrivado': 'DirectMessageTyping',
    'MensajesDirectos': 'DirectMessages',
    'ExpresionesDelServidor': 'GuildExpressions',
    'IntegracionesDelServidor': 'GuildIntegrations',
    'InvitacionesDelServidor': 'GuildInvites',
    'MiembrosDelServidor': 'GuildMembers',
    'EncuestasDelServidor': 'GuildPolls',
    'ReaccionesEnServidor': 'GuildMessageReactions',
    'EscribiendoEnElServidor': 'GuildMessageTyping',
    'MensajesDelServidor': 'GuildMessages',
    'ModeracionDelServidor': 'GuildModeration',
    'EstadosDelServidor': 'GuildPresences',
    'EventosProgramadosDelServidor': 'GuildScheduledEvents',
    'EstadosDeVozDelServidor': 'GuildVoiceStates',
    'WebhooksDelServidor': 'GuildWebhooks',
    'Servidores': 'Guilds',
    'ContenidoDelMensaje': 'MessageContent'
} as const);

/**
 * Map translating DisChord color aliases to standardized Discord Embed color identifiers.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const EmbedColors: Record<string, string> = dictionary({
    'Aqua': 'Aqua',
    'Azul': 'Blue',
    'Desenfocado': 'Blurple',
    'AquaOscuro': 'DarkAqua',
    'AzulOscuro': 'DarkBlue',
    'Oscuro': 'DarkButNotBlack',
    'OroOscuro': 'DarkGold',
    'VerdeOscuro': 'DarkGreen',
    'GrisOscuro': 'DarkGrey',
    'AzulMarinoOscuro': 'DarkNavy',
    'NaranjaOscuro': 'DarkOrange',
    'MoradoOscuro': 'DarkPurple',
    'RojoOscuro': 'DarkRed',
    'RosaVividoOscuro': 'DarkVividPink',
    'GrisMuyOscuro': 'DarkerGrey',
    'Predeterminado': 'Default',
    'DiscordOscuro': 'DiscordDark',
    'DiscordClaro': 'DiscordLight',
    'Fucsia': 'Fuchsia',
    'Oro': 'Gold',
    'Verde': 'Green',
    'Gris': 'Grey',
    'GrisPurpura': 'Greyple',
    'GrisClaro': 'LightGrey',
    'RosaVividoLuminoso': 'LuminousVividPink',
    'AzulMarino': 'Navy',
    'CasiNegro': 'NotQuiteBlack',
    'Naranja': 'Orange',
    'Morado': 'Purple',
    'Aleatorio': 'Random',
    'Rojo': 'Red',
    'Blanco': 'White',
    'Amarillo': 'Yellow'
} as const);

/**
 * Map translating DisChord option type keywords to their corresponding `DiscordOptionType` enum values.
 *
 * @type {Readonly<Record<string, DiscordOptionType>>}
 */
export const DisChordTypeMap: Record<string, DiscordOptionType> = dictionary({
    "texto": DiscordOptionType.String,
    "entero": DiscordOptionType.Integer,
    "booleano": DiscordOptionType.Boolean,
    "usuario": DiscordOptionType.User,
    "canal": DiscordOptionType.Channel,
    "rol": DiscordOptionType.Role,
    "mencionable": DiscordOptionType.Mentionable,
    "numero": DiscordOptionType.Number,
    "archivo": DiscordOptionType.Attachment
} as const);

/**
 * The type of an injected name: a class of the core library, and with `indefinido` too if the name
 * may not carry a value (the previous message of an edit is only there if it was cached), or a primitive type.
 */
export type InjectedType = { readonly className: string; readonly optional?: boolean } | { readonly primitive: PrimitiveTypeName };

/**
 * The type of the values of the names dischord puts in scope, by name: the ones it is known for. A
 * name left out has no type (`cualquiera`). Shared by the parameters of the events and the names of a command.
 *
 * @type {Readonly<Record<string, InjectedType>>}
 */
export const InjectedTypes: Record<string, InjectedType> = dictionary({
    "usuario": { className: "Usuario" },
    "miembro": { className: "Miembro" },
    "mensaje": { className: "Mensaje" },
    "mensajeAnterior": { className: "Mensaje", optional: true },
    "servidorId": { primitive: "texto" }
});

/**
 * The type of the value of a command option, by the Discord option type `DisChordTypeMap` gives its
 * keyword: a primitive type (`texto`, `numero`, `booleano`) or a class of the core library (`Usuario`).
 * An option type left out gives no type.
 *
 * @type {Readonly<Partial<Record<DiscordOptionType, string>>>}
 */
export const OptionValueTypes: Partial<Record<DiscordOptionType, string>> = {
    [DiscordOptionType.String]: "texto",
    [DiscordOptionType.Integer]: "numero",
    [DiscordOptionType.Number]: "numero",
    [DiscordOptionType.Boolean]: "booleano",
    [DiscordOptionType.User]: "Usuario"
};

/**
 * Map translating DisChord application installation keywords to `ApplicationIntegrationType` enum values.
 *
 * @type {Readonly<Record<string, ApplicationIntegrationType>>}
 */
export const IntegrationTypes: Record<string, ApplicationIntegrationType> = dictionary({
    "Servidor": ApplicationIntegrationType.GuildInstall,
    "Usuario": ApplicationIntegrationType.UserInstall
} as const);

/**
 * Map translating DisChord interaction context keywords to `InteractionContextType` enum values.
 *
 * @type {Readonly<Record<string, InteractionContextType>>}
 */
export const ContextTypes: Record<string, InteractionContextType> = dictionary({
    "Servidor": InteractionContextType.Guild,
    "DM": InteractionContextType.BotDM,
    "CanalPrivado": InteractionContextType.PrivateChannel
} as const);

/**
 * Map translating DisChord command type exclusion flags to `IgnoreCommandType` enum values.
 *
 * @type {Readonly<Record<string, IgnoreCommandType>>}
 */
export const IgnoreCommandTypes: Record<string, IgnoreCommandType> = dictionary({
    "Mensajes": IgnoreCommandType.Message,
    "Slashs": IgnoreCommandType.Slash
} as const);

/**
 * Map translating DisChord channel kinds to Discord's `ChannelType` numeric values (the ones a
 * guild channel can be created or edited as).
 *
 * @type {Readonly<Record<string, number>>}
 */
export const ChannelTypes: Record<string, number> = dictionary({
    "texto": 0,
    "voz": 2,
    "categoria": 4,
    "anuncios": 5,
    "escenario": 13,
    "foro": 15,
    "multimedia": 16
} as const);

/**
 * The events that were renamed, by their old name, so that using one says what it is called now.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const RenamedEvents: Record<string, string> = dictionary({
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
export const EventGuildSources: Record<string, string> = dictionary({
    "mensaje": "mensaje.guildId",
    "canal": "canal.guildId",
    "miembro": "miembro.guildId",
    "rol": "rol.guildId",
    "servidor": "servidor.id",
    "servidorId": "servidorId",
    "interaccion": "interaccion.guildId"
} as const);

/**
 * The server a command's channel action defaults to: the one the command was run in.
 * @type {string}
 */
export const CommandGuildSource = `${CommandContextParameter}.guildId`;

/**
 * The channel action each channel event is triggered by. An event that performs it would trigger
 * itself over and over, so the analyzer rejects it there.
 *
 * @type {Readonly<Record<string, ChannelAction>>}
 */
export const EventSelfTriggers: Record<string, ChannelAction> = dictionary({
    "canalCreado": ChannelAction.Crear,
    "canalEditado": ChannelAction.Editar,
    "canalBorrado": ChannelAction.Borrar
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
