import { DisChordTokenType } from "./nodes";

/**
 * The verbs a channel block is written with: `crear canal`, `editar canal`, `borrar canal`,
 * `obtener canal` and `listar canales`. Unreserved words (they stay ordinary identifiers
 * everywhere else), told apart by the object word that follows (`ChannelActionObject`).
 * @type {const}
 */
export const ChannelAction = {
    Crear: 'crear',
    Editar: 'editar',
    Borrar: 'borrar',
    Obtener: 'obtener',
    Listar: 'listar'
} as const;

/** The action a `ChannelActionNode` performs. */
export type ChannelAction = typeof ChannelAction[keyof typeof ChannelAction];

/**
 * The word that follows each verb: `canal`, except for listing, which is of `canales`.
 * @type {Readonly<Record<ChannelAction, string>>}
 */
export const ChannelActionObject: Readonly<Record<ChannelAction, string>> = {
    [ChannelAction.Crear]: DisChordTokenType.Canal,
    [ChannelAction.Editar]: DisChordTokenType.Canal,
    [ChannelAction.Borrar]: DisChordTokenType.Canal,
    [ChannelAction.Obtener]: DisChordTokenType.Canal,
    [ChannelAction.Listar]: DisChordTokenType.Canales
};

/**
 * The actions that change something on the server, which are the ones the preventive barriers
 * apply to. Reading (`obtener`, `listar`) changes nothing.
 * @type {readonly ChannelAction[]}
 */
export const ChannelWriteActions: readonly ChannelAction[] = [ ChannelAction.Crear, ChannelAction.Editar, ChannelAction.Borrar ];

/**
 * The verbs a moderation block is written with: `banear miembro`, `desbanear usuario` and
 * `expulsar miembro`. Unreserved words, like the channel ones, told apart by the object word that follows.
 * @type {const}
 */
export const ModerationAction = {
    Banear: 'banear',
    Desbanear: 'desbanear',
    Expulsar: 'expulsar'
} as const;

/** The action a `ModerationActionNode` performs. */
export type ModerationAction = typeof ModerationAction[keyof typeof ModerationAction];

/**
 * The word that follows each verb: a `miembro` is banned or kicked, a `usuario` (who may have left
 * the server) is unbanned.
 * @type {Readonly<Record<ModerationAction, string>>}
 */
export const ModerationActionObject: Readonly<Record<ModerationAction, string>> = {
    [ModerationAction.Banear]: 'miembro',
    [ModerationAction.Desbanear]: 'usuario',
    [ModerationAction.Expulsar]: 'miembro'
};

/**
 * The properties of a moderation block that are read by name outside the schemas: the user it is
 * about, the audit log reason, the server, and the seconds of messages `banear` deletes.
 * @type {const}
 */
export const ModerationProperty = {
    Usuario: 'usuario',
    Razon: 'razon',
    Servidor: 'servidor',
    BorrarMensajes: 'borrarMensajes'
} as const;

/** The range of seconds of messages a ban can delete (0 to 7 days), as Discord accepts it. */
export const BanDeleteMessageSeconds = { Min: 0, Max: 604800 } as const;

/**
 * The properties naming a channel or a server, or qualifying an action on one, that are read by
 * name outside the schemas: the target channel (also the one a message is sent to), the id and the name of the
 * channel to obtain, the server to create in and the audit log reason. `Canal` is the same word as the object of a channel action.
 * @type {const}
 */
export const ChannelProperty = {
    Canal: DisChordTokenType.Canal,
    Id: 'id',
    Nombre: 'nombre',
    Servidor: 'servidor',
    Razon: 'razon'
} as const;

/**
 * The field of Discord's channel payload that holds a channel's parent category. Written once
 * because both the schemas (which fill it from `categoria`) and the runtime helper (which resolves
 * an object or a promise to its id) have to name it.
 * @type {const}
 */
export const ChannelPayload = {
    Parent: 'parent_id'
} as const;
