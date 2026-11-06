import { ASTNode, BaseNode, ODBNode, TokenType } from "../../chord/model/types";
import type { ChannelAction, ModerationAction } from "./actions";

/**
 * Registry of high-level syntactic syntax structures for DisChord bots.
 */
export const DisChordTokenType = {
    Comando: 'comando',
    Evento: 'evento',
    Enviar: 'enviar',
    Recolector: 'recolector',
    Encender: 'encender',
    Bot: 'bot',

    Embed: 'embed',
    Boton: 'boton',
    Canal: 'canal',
    Canales: 'canales',

    ENCENDER_BOT: 'EncenderBot',
    EVENTO: 'Evento',
    CREAR_COMANDO: 'CrearComando',
    CREAR_MENSAJE: 'CrearMensaje',
    ACCION_CANAL: 'AccionCanal',
    ACCION_MODERACION: 'AccionModeracion',
    CREAR_RECOLECTOR: 'CrearRecolector',
    CREAR_EMBED: 'CrearEmbed',
    CREAR_BOTON: 'CrearBoton'
} as const;

/** Extract the literal string values */
export type DisChordTokenType = typeof DisChordTokenType[keyof typeof DisChordTokenType];

/**
 * Unified node type classification combining core Chord tokens and high-level DisChord bot extensions.
 */
export type DisChordNodeType = TokenType | DisChordTokenType;

/** Explicit local evaluation bindings mapping DisChord abstract tree branches */
export type DisChordNode =
    | StartBotNode
    | EventNode
    | CommandNode
    | MessageNode
    | ChannelActionNode
    | ModerationActionNode
    | CollectorNode
    | EmbedDeclarationNode
    | ButtonDeclarationNode;

/** Specialized variant resolving highly encapsulated Object Data Block syntax layouts for Discord payloads */
export type DisChordODBNode = ODBNode<DisChordNodeType, DisChordNode>;

/** Comprehensive root syntax tree union linking base Chord grammar nodes seamlessly with DisChord modules */
export type DisChordASTNode = ASTNode<DisChordNodeType, DisChordNode>;

/**
 * Syntactic node representing the core bot engine initialization block.
 * Maps directly to your standard user runtime structure: "encender bot { token 'mitoken' }"
 * @interface StartBotNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface StartBotNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.ENCENDER_BOT;
    object: DisChordODBNode;
}

/**
 * Syntactic node intercepting high-level Discord gateway connection API hooks.
 * @interface EventNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface EventNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.EVENTO;
    name: string;
    body: DisChordASTNode[];
}

/**
 * Syntactic node mapping standard chat input framework registration descriptors.
 * @interface CommandNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface CommandNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.CREAR_COMANDO;
    value: string;
    body: DisChordODBNode;
}

/**
 * Syntactic node defining dynamic runtime component interaction framework interceptors.
 * @interface CollectorNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface CollectorNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.CREAR_RECOLECTOR;
    variable: DisChordASTNode;
    methods: DisChordODBNode;
}

/**
 * Syntactic node encapsulating message composition routines tracking channel outputs pipelines.
 * @interface MessageNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface MessageNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.CREAR_MENSAJE;
    object: DisChordODBNode;
}

/**
 * Syntactic node for `crear canal { ... }`, `editar canal { ... }` and `borrar canal { ... }`:
 * one node for the three, which differ only in the schema their block is checked against and the
 * call generated.
 * @interface ChannelActionNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface ChannelActionNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.ACCION_CANAL;
    action: ChannelAction;
    object: DisChordODBNode;
    guild?: string;
}

/**
 * Syntactic node for `banear miembro { ... }`, `desbanear usuario { ... }` and `expulsar miembro { ... }`:
 * one node for the three, which differ only in the schema their block is checked against and the
 * call generated.
 * @interface ModerationActionNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface ModerationActionNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.ACCION_MODERACION;
    action: ModerationAction;
    object: DisChordODBNode;
    guild?: string;
}

/**
 * Syntactic node for an embed value: `embed <Nombre> { ... }`. Always generates a plain
 * `new Embed()...` expression (never self-wraps in a variable) — when written as its own
 * top-level statement (`nuevo embed <Nombre> { ... }`), `DisChordStatementParser` wraps it in a
 * regular `VariableNode` so `<Nombre>` becomes reusable; when written inline as a value (e.g. as
 * the `embed` property of an `enviar mensaje {}`), it's used as-is. See
 * `UnreservedComponentDeclarations` for how `embed <Nombre> {` gets dispatched here in the first
 * place, without `embed` being a reserved keyword.
 * @interface EmbedDeclarationNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface EmbedDeclarationNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.CREAR_EMBED;
    name: string;
    body: DisChordODBNode;
}

/**
 * Syntactic node for a button value: `boton <Nombre> { ... }`. Same shape and lifecycle as
 * `EmbedDeclarationNode` — always generates a plain `new Button()...` expression; gets wrapped in
 * a `VariableNode` by `DisChordStatementParser` only when reached at statement level.
 * @interface ButtonDeclarationNode
 * @extends BaseNode<DisChordNodeType>
 */
export interface ButtonDeclarationNode extends BaseNode<DisChordNodeType> {
    type: typeof DisChordTokenType.CREAR_BOTON;
    name: string;
    body: DisChordODBNode;
}

/**
 * Kinds of name DisChord's own constructs declare, besides the ones of `DeclarationKind`.
 * @type {const}
 */
export const DisChordDeclarationKind = {
    Command: 'command',
    Event: 'event',
    Button: 'button',
    Embed: 'embed'
} as const;
