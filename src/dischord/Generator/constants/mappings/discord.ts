import { dictionary } from "./dictionary";

/**
 * Map translating DisChord Gateway Intent aliases into standard Discord Gateway Intent flags.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const intentsMap: Readonly<Record<string, string>> = dictionary({
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
export const EmbedColors: Readonly<Record<string, string>> = dictionary({
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
 * Map translating DisChord channel kinds to Discord's `ChannelType` numeric values (the ones a
 * guild channel can be created or edited as).
 *
 * @type {Readonly<Record<string, number>>}
 */
export const ChannelTypes: Readonly<Record<string, number>> = dictionary({
    "texto": 0,
    "voz": 2,
    "categoria": 4,
    "anuncios": 5,
    "escenario": 13,
    "foro": 15,
    "multimedia": 16
} as const);

/**
 * The directories, relative to the output's base one, where Seyfert's loader looks for each kind
 * of module. The compiler writes them into `seyfert.config.mjs` and makes sure they exist.
 *
 * @type {Readonly<{ commands: string, events: string, components: string }>}
 */
export const SeyfertLocations = {
    commands: 'comandos',
    events: 'eventos',
    components: 'componentes'
} as const;
