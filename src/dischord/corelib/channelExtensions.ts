import { ChannelTypes } from "../Generator/constants/mappings";
import { corelib, DisChordClassesEnum } from "./corelib.data";

/**
 * Spanish property name -> the real Seyfert channel property/method it reads, taken from the
 * `Canal` class of `corelib`. `channelExtensionsModuleContent` below generates its runtime getters
 * straight from this map (so the two can never drift apart), and `RequiresChannelExtensionsRule`
 * scans for the same keys.
 * @type {Readonly<Record<string, string>>}
 */
export const channelPropertyNames: Readonly<Record<string, string>> = Object.fromEntries(
    Object.entries(corelib.classes[DisChordClassesEnum.Canal].properties ?? {}).map(([spanish, member]) => [spanish, member.transpile])
);

/**
 * The Spanish name of each channel kind by its number (`2` is `voz`): the inverse of `ChannelTypes`,
 * the table `tipo` is written with in a `crear canal`.
 * @type {Readonly<Record<number, string>>}
 */
export const channelKindNames: Readonly<Record<number, string>> = Object.fromEntries(
    Object.entries(ChannelTypes).map(([name, type]) => [type, name])
);

/**
 * Path, relative to the project's `dist` directory, where `channelExtensionsModuleContent` is
 * written. Shared by `CompileCommand` (which writes the file there) and
 * `RequiresChannelExtensionsRule` (which imports it).
 * @type {string}
 */
export const channelExtensionsModulePath = 'lib/channelExtensions.js';

/**
 * Raw JavaScript string content for the shared runtime module that patches Seyfert's channel
 * classes with Spanish-named getters (`canal.nombre`, `canal.tema`, ...), the same way
 * `userExtensionsModuleContent` does for users: a channel reaches the code as the result of a
 * block (`crear canal`...), as a command option or as a list item, with no fixed identifier to
 * rewrite at compile time.
 *
 * Every channel class extends `BaseNoEditableChannel`, so one prototype covers them all. `tipo` is
 * the only getter that is not a plain read: the kind arrives as a number and is given back as the
 * word the `tipo` of a `crear canal` is written with.
 * @type {string}
 */
export const channelExtensionsModuleContent = `
    import { BaseNoEditableChannel } from 'seyfert';

    const KINDS = ${JSON.stringify(channelKindNames)};

    const channelAccessors = new Map([
${Object.entries(channelPropertyNames).map(([spanish, real]) => `        ['${spanish}', (c) => c.${real}]`).join(',\n')}
    ]);

    channelAccessors.set('tipo', (c) => KINDS[c.type]);

    for (const [name, resolve] of channelAccessors) {
        Object.defineProperty(BaseNoEditableChannel.prototype, name, { get() { return resolve(this); }, configurable: true });
    }
`;
