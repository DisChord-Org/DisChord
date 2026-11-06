import { CoreLibClass } from "../../../chord/corelib/corelib.types";
import { ClassDataType } from "../../../chord/model/DataType";
import { DisChordClassesEnum } from "./DisChordClassesEnum";
import { userData } from "./userData";

/**
 * Seyfert `User`/`GuildMember` data under Spanish names. These are not rewritten at compile
 * time: a command option typed `opcion "usuario"` can be bound to any variable name, so
 * there is no fixed identifier to translate. `userExtensions` patches the real classes at
 * runtime instead (`transpile` is the `User` property or method each getter reads), which
 * is why every member is `runtime`.
 *
 * Keys must never equal a raw field name Seyfert assigns internally while constructing its
 * own `User`/`ClientUser`/`GuildMember` objects (`Object.assign(this, rawData)` in
 * `ClientUser`/`DiscordBase`) — a getter-only accessor of the same name on the prototype
 * blocks that assignment outright (`Cannot set property flags of [object Object] which has
 * only a getter`), breaking construction of every such object, not just property access.
 * This is why the keys are `avatarUrl`/`bannerUrl`/`insignias` rather than the more literal
 * `avatar`/`banner`/`flags` — those three collide with real raw fields.
 */
export const usuarioClass: CoreLibClass = {
    receiver: ClassDataType.of(DisChordClassesEnum.Usuario),
    methods: {},
    properties: userData
};
