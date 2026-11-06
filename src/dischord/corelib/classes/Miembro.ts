import { CoreLibClass } from "../../../chord/corelib/corelib.types";
import { ClassDataType } from "../../../chord/model/DataType";
import { DisChordClassesEnum } from "./DisChordClassesEnum";
import { userData } from "./userData";

/**
 * A server member (Seyfert `GuildMember`): the member of a server event or of an option typed
 * `opcion "miembro"`, or the one who wrote a message. Seyfert's `GuildMember` wraps a `User` by
 * composition, and the runtime module gives it the getters of `Usuario` that read its `user`,
 * so it has the same members and no others.
 */
export const miembroClass: CoreLibClass = {
    receiver: ClassDataType.of(DisChordClassesEnum.Miembro),
    methods: {},
    properties: userData
};
