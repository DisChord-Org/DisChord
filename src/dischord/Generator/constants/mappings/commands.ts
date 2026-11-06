import { PrimitiveTypeName } from "../../../../chord/model/types";
import { ApplicationIntegrationType, DiscordOptionType, IgnoreCommandType, InteractionContextType } from "../../../types";
import { dictionary } from "./dictionary";

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
 * The server a command's channel action defaults to: the one the command was run in.
 * @type {string}
 */
export const CommandGuildSource = `${CommandContextParameter}.guildId`;

/**
 * Map translating DisChord option type keywords to their corresponding `DiscordOptionType` enum values.
 *
 * @type {Readonly<Record<string, DiscordOptionType>>}
 */
export const DisChordTypeMap: Readonly<Record<string, DiscordOptionType>> = dictionary({
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
export const InjectedTypes: Readonly<Record<string, InjectedType>> = dictionary({
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
export const OptionValueTypes: Readonly<Partial<Record<DiscordOptionType, string>>> = {
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
export const IntegrationTypes: Readonly<Record<string, ApplicationIntegrationType>> = dictionary({
    "Servidor": ApplicationIntegrationType.GuildInstall,
    "Usuario": ApplicationIntegrationType.UserInstall
} as const);

/**
 * Map translating DisChord interaction context keywords to `InteractionContextType` enum values.
 *
 * @type {Readonly<Record<string, InteractionContextType>>}
 */
export const ContextTypes: Readonly<Record<string, InteractionContextType>> = dictionary({
    "Servidor": InteractionContextType.Guild,
    "DM": InteractionContextType.BotDM,
    "CanalPrivado": InteractionContextType.PrivateChannel
} as const);

/**
 * Map translating DisChord command type exclusion flags to `IgnoreCommandType` enum values.
 *
 * @type {Readonly<Record<string, IgnoreCommandType>>}
 */
export const IgnoreCommandTypes: Readonly<Record<string, IgnoreCommandType>> = dictionary({
    "Mensajes": IgnoreCommandType.Message,
    "Slashs": IgnoreCommandType.Slash
} as const);
