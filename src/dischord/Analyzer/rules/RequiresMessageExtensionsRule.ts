import { SharedModule } from "../../../chord/model/SharedModule";
import { messageExtensionsModule, messagePropertyNames } from "../../corelib";
import { RequiresPatchedMembersRule } from "./RequiresPatchedMembersRule";

/**
 * Inserts the import of the shared runtime module `messageExtensionsModule.content`, which patches
 * Seyfert's `BaseMessage` prototype with the Spanish message getters (`mensaje.contenido`,
 * `mensaje.autor`, ...), when the file reads one of them: see `RequiresPatchedMembersRule` for when an
 * access counts (and that access by index is not detected). Unlike the user module it has no trigger of
 * its own: there is no option type that hands the code a message.
 */
export class RequiresMessageExtensionsRule extends RequiresPatchedMembersRule {
    protected readonly patchedNames: Readonly<Record<string, string>> = messagePropertyNames;
    protected readonly module: SharedModule = messageExtensionsModule;
}
