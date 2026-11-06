
/** The visual styles of a message button, by the Spanish names the language uses. */
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

/**
 * Seyfert declaration that specifies which type of context has to be ignored 
 * @enum {number}
 */
export enum IgnoreCommandType {
    /**
     * SlashCommand contexts
     */
    Slash = 0,
    /**
     * MessageComand contexts
     */
    Message = 1
}
