import { corelib, DisChordClassesEnum } from "./corelib.data";
import { SharedModule } from "../../chord/model/SharedModule";

/**
 * Spanish property name -> the expression over a Seyfert message that it reads, taken from the
 * `Mensaje` class of `corelib`. `messageExtensionsModule` below generates its runtime getters
 * straight from this map (so the two can never drift apart), and `RequiresMessageExtensionsRule`
 * scans for these same keys to decide whether a file needs the import.
 * @type {Readonly<Record<string, string>>}
 */
export const messagePropertyNames: Readonly<Record<string, string>> = Object.fromEntries(
    Object.entries(corelib.classes[DisChordClassesEnum.Mensaje].properties ?? {}).map(([spanish, member]) => [spanish, member.transpile])
);

/**
 * A shared module: its `path`, relative to the project's `dist` directory, where `CompileCommand` writes it,
 * and its `content`.
 *
 * Raw JavaScript string content for the shared runtime module that patches Seyfert's `BaseMessage`
 * prototype with Spanish-named getters (`mensaje.contenido`, `mensaje.autor`, ...). It exists for the same
 * reason `userExtensionsModule` does: the variable that holds a message can be called anything, so there is
 * no fixed identifier to translate at compile time. `Message` and `WebhookMessage` (what replying to an
 * interaction gives back) both extend `BaseMessage`, so patching it covers both.
 * @type {SharedModule}
 */
export const messageExtensionsModule: SharedModule = {
    path: 'lib/messageExtensions.js',
    content: `
    import { BaseMessage } from 'seyfert';

    const messageAccessors = new Map([
${Object.entries(messagePropertyNames).map(([spanish, real]) => `        ['${spanish}', (m) => m.${real}]`).join(',\n')}
    ]);

    for (const [name, resolve] of messageAccessors) {
        Object.defineProperty(BaseMessage.prototype, name, { get() { return resolve(this); }, configurable: true });
    }
`
};
