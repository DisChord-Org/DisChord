import { SharedModule } from "../../chord/model/SharedModule";
import { userExtensionsModule, userPropertyNames } from "./userExtensions";
import { messageExtensionsModule, messagePropertyNames } from "./messageExtensions";

/**
 * A shared runtime module that patches Seyfert's classes with Spanish-named getters, found by the
 * access to one of those names: the variable that holds the object can be called anything, so there is
 * no fixed identifier to translate at compile time. See `RequiresPatchedMembersRule` for when a file
 * imports the module (an access to one of the names, Discord context, and that access by index is not
 * detected).
 */
export interface PatchedExtension {
    /** Names the rule that imports the module: `Requires<name>ExtensionsRule`. */
    readonly name: string;
    /** The Spanish names the module patches. */
    readonly patchedNames: Readonly<Record<string, string>>;
    /** The module that does the patching. */
    readonly module: SharedModule;
    /**
     * A command option type (`tipo "usuario"`) whose mere declaration makes the file import the module,
     * since the option can be bound to any variable name. Without it, only the access to a patched name does.
     */
    readonly optionType?: string;
}

/**
 * The patched-members modules, in the order their imports are inserted. Adding one is adding an entry
 * here: its module goes in its own file next to `userExtensions.ts`, and `DisChordAnalyzer` builds the
 * rule that imports it from this list. (The channel module has triggers of its own: a channel block
 * produces one wherever it goes, whatever the name accessed; it has its own rule.)
 *
 * The user module has the extra `tipo "usuario"` trigger, at the cost of an unused import in the rare
 * file that declares the option but never reads any of its Spanish-named data. The message module has
 * none: there is no option type that hands the code a message.
 * @type {readonly PatchedExtension[]}
 */
export const patchedExtensions: readonly PatchedExtension[] = [
    { name: 'User', patchedNames: userPropertyNames, module: userExtensionsModule, optionType: 'usuario' },
    { name: 'Message', patchedNames: messagePropertyNames, module: messageExtensionsModule }
];
