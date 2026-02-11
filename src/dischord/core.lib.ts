export const corelib: Record<string, Record<string, string> | string> = {
    'usuario': {
        'nombre': 'usuario.username'
    },
    'imprimir': 'cliente.logger.info'
} as const;

interface EventType {
    name: string;
    params: string[];
}

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