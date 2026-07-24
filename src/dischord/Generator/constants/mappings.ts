import { ApplicationIntegrationType, DiscordOptionType, IgnoreCommandType, InteractionContextType } from "../../types";

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
 * Map translating DisChord Spanish event identifiers to their corresponding internal Discord event structures.
 *
 * @type {Readonly<Record<string, EventType>>}
 */
export const eventsMap: Record<string, EventType> = {
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
} as const;

/**
 * Map translating DisChord Gateway Intent aliases into standard Discord Gateway Intent flags.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const intentsMap: Record<string, string> = {
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
} as const;

/**
 * Map translating DisChord color aliases to standardized Discord Embed color identifiers.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const EmbedColors: Record<string, string> = {
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
} as const;

/**
 * Map translating DisChord option type keywords to their corresponding `DiscordOptionType` enum values.
 *
 * @type {Readonly<Record<string, DiscordOptionType>>}
 */
export const DisChordTypeMap: Record<string, DiscordOptionType> = {
    "texto": DiscordOptionType.String,
    "entero": DiscordOptionType.Integer,
    "booleano": DiscordOptionType.Boolean,
    "usuario": DiscordOptionType.User,
    "canal": DiscordOptionType.Channel,
    "rol": DiscordOptionType.Role,
    "mencionable": DiscordOptionType.Mentionable,
    "numero": DiscordOptionType.Number,
    "archivo": DiscordOptionType.Attachment
} as const;

/**
 * Map translating DisChord application installation keywords to `ApplicationIntegrationType` enum values.
 *
 * @type {Readonly<Record<string, ApplicationIntegrationType>>}
 */
export const IntegrationTypes: Record<string, ApplicationIntegrationType> = {
    "Servidor": ApplicationIntegrationType.GuildInstall,
    "Usuario": ApplicationIntegrationType.UserInstall
} as const;

/**
 * Map translating DisChord interaction context keywords to `InteractionContextType` enum values.
 *
 * @type {Readonly<Record<string, InteractionContextType>>}
 */
export const ContextTypes: Record<string, InteractionContextType> = {
    "Servidor": InteractionContextType.Guild,
    "DM": InteractionContextType.BotDM,
    "CanalPrivado": InteractionContextType.PrivateChannel
} as const;

/**
 * Map translating DisChord command type exclusion flags to `IgnoreCommandType` enum values.
 *
 * @type {Readonly<Record<string, IgnoreCommandType>>}
 */
export const IgnoreCommandTypes: Record<string, IgnoreCommandType> = {
    "Mensajes": IgnoreCommandType.Message,
    "Slashs": IgnoreCommandType.Slash
} as const;
