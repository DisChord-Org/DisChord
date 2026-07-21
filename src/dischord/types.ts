import { ASTNode, BaseNode, ODBNode, TokenType } from "../chord/types";

/**
 * @file types.ts
 * @description Domain-specific abstract syntax tree extensions specialized for high-level Discord bot orchestration.
 */

/**
 * Registry of high-level syntactic syntax structures for DisChord bots.
 */
export const DisChordTokenType = {
    Comando: 'comando',
    Evento: 'evento',
    Mensaje: 'mensaje',
    Recolector: 'recolector',
    Encender: 'encender',
    Bot: 'bot',

    ENCENDER_BOT: 'EncenderBot',
    EVENTO: 'Evento',
    CREAR_COMANDO: 'CrearComando',
    CREAR_MENSAJE: 'CrearMensaje',
    CREAR_RECOLECTOR: 'CrearRecolector'
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
    | CollectorNode;

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
 * Visual design configurations defining presentation properties for interactive message UI elements.
 * @enum {number}
 */
export enum ButtonStyles {
    azul = 1,
    gris,
    verde,
    rojo,
    enlace,
    premium
}

/**
 * Mapping specifications aligning application payload settings with internal Discord gateway interface typings.
 * @enum {number}
 */
export enum DiscordOptionType {
    SubCommand = 1,
    SubCommandGroup = 2,
    String = 3,
    Integer = 4,
    Boolean = 5,
    User = 6,
    Channel = 7,
    Role = 8,
    Mentionable = 9,
    Number = 10,
    Attachment = 11
}

/**
 * https://discord.com/developers/docs/resources/application#application-object-application-integration-types
 * @enum {number}
 */
export enum ApplicationIntegrationType {
    /**
     * App is installable to servers
     */
    GuildInstall = 0,
    /**
     * App is installable to users
     */
    UserInstall = 1
}

/**
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-context-types
 * @enum {number}
 */
export enum InteractionContextType {
    /**
     * Interaction can be used within servers
     */
    Guild = 0,
    /**
     * Interaction can be used within DMs with the app's bot user
     */
    BotDM = 1,
    /**
     * Interaction can be used within Group DMs and DMs other than the app's bot user
     */
    PrivateChannel = 2
}