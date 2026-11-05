import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Test } from "../../../Test";
import { corelib as chordCorelib } from "../../../../src/chord/corelib/corelib.data";
import { messageExtensionsModule, messagePropertyNames } from "../../../../src/dischord/corelib";

/**
 * @class MessageExtensionsTest
 * @description Runs the shared module that gives messages their Spanish properties (`contenido`,
 * `autor`...) against a stand-in for Seyfert's `BaseMessage`, since `seyfert` is not installed in this
 * repository, and checks that none of those names is a member the core library already gives a value
 * (a lookup by name on a receiver of unknown type would rewrite it).
 */
export class MessageExtensionsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Message Extensions - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to define the Spanish properties of a message over the real fields, with names no other class takes';

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        const chordMembers = new Set(Object.values<{ methods: object; properties?: object }>(chordCorelib.classes).flatMap(entry => [ ...Object.keys(entry.methods), ...Object.keys(entry.properties ?? {}) ]));
        const clashing = Object.keys(messagePropertyNames).filter(name => chordMembers.has(name));

        if (clashing.length > 0) throw new Error(`Message properties named like a core library member: ${clashing.join(', ')}`);

        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-message-extensions-'));

        try {
            const stub = path.join(directory, 'node_modules', 'seyfert');
            fs.mkdirSync(stub, { recursive: true });
            fs.writeFileSync(path.join(stub, 'package.json'), JSON.stringify({ name: 'seyfert', type: 'module', main: 'index.js' }));
            fs.writeFileSync(path.join(stub, 'index.js'), `
                export class BaseMessage {
                    constructor (fields) { Object.assign(this, fields); }
                }
            `);

            const file = path.join(directory, 'messageExtensions.mjs');
            fs.writeFileSync(file, messageExtensionsModule.content);
            await import(pathToFileURL(file).href);

            const { BaseMessage } = await import(pathToFileURL(path.join(stub, 'index.js')).href);
            const author = { username: 'ana' };
            const message: any = new BaseMessage({
                content: 'hola', author, member: { nick: 'a' }, channelId: '5', guildId: 'G',
                url: 'https://discord.com/channels/G/5/1', pinned: true,
                attachments: [ { url: 'u1' }, { url: 'u2' } ], mentions: { users: [ author ] }
            });

            this.expectEqual(message.contenido, 'hola', 'contenido');
            this.expectEqual(message.autor, author, 'autor');
            this.expectEqual(message.miembro.nick, 'a', 'miembro');
            this.expectEqual(message.canalId, '5', 'canalId');
            this.expectEqual(message.servidorId, 'G', 'servidorId');
            this.expectEqual(message.enlace, 'https://discord.com/channels/G/5/1', 'enlace');
            this.expectEqual(message.fijado, true, 'fijado');
            this.expectEqual(message.adjuntos.join(','), 'u1,u2', 'adjuntos');
            this.expectEqual(message.menciones[0], author, 'menciones');
        } finally {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }

    private expectEqual (actual: unknown, expected: unknown, label: string): void {
        if (actual !== expected) throw new Error(`${label}: expected ${String(expected)}, got ${String(actual)}`);
    }
}
