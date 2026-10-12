import { ApplicationIntegrationType, ChannelAction, DiscordOptionType, IgnoreCommandType, InteractionContextType } from "../../types";

/**
 * @interface EventType
 * @property {string} name - The internal or low-level Discord event name.
 * @property {string[]} params - The list of parameters injected into the event handler callback.
 */
interface EventType {
    name: string;
    params: string[];
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
        'params': [ 'mensaje', 'mensajeBorrado', 'cliente' ]
    },
    'mensajeEditado': {
        'name': 'messageUpdate',
        'params': [ 'mensaje', 'mensajeEditado', 'cliente' ]
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
        'params': [ 'canal', 'cliente' ]
    },
    'ban': {
        'name': 'guildBanAdd',
        'params': [ 'miembro', 'cliente' ]
    },
    'unban': {
        'name': 'guildBanRemove',
        'params': [ 'miembro', 'cliente' ]
    },
    'invitado': {
        'name': 'guildCreate',
        'params': [ 'servidor', 'cliente' ]
    },
    'expulsado': {
        'name': 'guildDelete',
        'params': [ 'servidor', 'cliente' ]
    },
    'entradaMiembro': {
        'name': 'guildMemberAdd',
        'params': [ 'miembro', 'cliente' ]
    },
    'idaMiembro': {
        'name': 'guildMemberRemove',
        'params': [ 'miembro', 'cliente' ]
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
        'params': [ 'rol', 'cliente' ]
    },
    'limitado': {
        'name': 'rateLimited',
        'params': [ 'ratelimit' ]
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
