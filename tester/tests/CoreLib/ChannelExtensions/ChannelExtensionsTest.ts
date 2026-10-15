import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Test } from "../../../Test";
import { channelExtensionsModule, channelPropertyNames } from "../../../../src/dischord/corelib";

/**
 * @class ChannelExtensionsTest
 * @description Runs the shared module that gives channels their Spanish properties (`nombre`,
 * `tipo`...) against a stand-in for Seyfert's `BaseNoEditableChannel`, since `seyfert` is not
 * installed in this repository: each getter reads the real field, `tipo` turns the numeric type
 * into its Spanish name, and the fields that already read the same in both languages get no getter.
 */
export class ChannelExtensionsTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channel Extensions - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to define the Spanish properties of a channel over the real fields';

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-channel-extensions-'));

        try {
            const stub = path.join(directory, 'node_modules', 'seyfert');
            fs.mkdirSync(stub, { recursive: true });
            fs.writeFileSync(path.join(stub, 'package.json'), JSON.stringify({ name: 'seyfert', type: 'module', main: 'index.js' }));
            fs.writeFileSync(path.join(stub, 'index.js'), `
                export class BaseNoEditableChannel {
                    constructor (fields) { Object.assign(this, fields); }
                    toString () { return '<#' + this.id + '>'; }
                }
            `);

            const file = path.join(directory, 'channelExtensions.mjs');
            fs.writeFileSync(file, channelExtensionsModule.content);
            await import(pathToFileURL(file).href);

            const { BaseNoEditableChannel } = await import(pathToFileURL(path.join(stub, 'index.js')).href);
            const make = (fields: any) => new BaseNoEditableChannel(fields);

            const channel: any = make({
                id: '55', name: 'avisos', topic: 'Novedades', type: 0, parentId: '9', position: 3,
                rateLimitPerUser: 5, userLimit: 10, guildId: 'A', lastMessageId: '77',
                url: 'https://discord.com/channels/A/55', createdAt: new Date(0)
            });

            this.expectEqual(channel.nombre, 'avisos', 'nombre');
            this.expectEqual(channel.tema, 'Novedades', 'tema');
            this.expectEqual(channel.categoria, '9', 'categoria');
            this.expectEqual(channel.posicion, 3, 'posicion');
            this.expectEqual(channel.modoLento, 5, 'modoLento');
            this.expectEqual(channel.limiteUsuarios, 10, 'limiteUsuarios');
            this.expectEqual(channel.servidor, 'A', 'servidor');
            this.expectEqual(channel.ultimoMensaje, '77', 'ultimoMensaje');
            this.expectEqual(channel.mencion, '<#55>', 'mencion');
            this.expectEqual(channel.enlace, 'https://discord.com/channels/A/55', 'enlace');
            this.expectEqual(channel.creadoEn.getTime(), 0, 'creadoEn');

            const kinds: [number, string | undefined][] = [
                [0, 'texto'], [2, 'voz'], [4, 'categoria'], [5, 'anuncios'], [13, 'escenario'], [15, 'foro'], [16, 'multimedia'], [99, undefined]
            ];

            kinds.forEach(([type, expected]) => this.expectEqual(make({ type }).tipo, expected, `tipo of type ${type}`));

            [ 'id', 'nsfw', 'bitrate' ].forEach(name => {
                if (name in channelPropertyNames) throw new Error(`'${name}' reads the same in both languages and must have no getter`);
                if (Object.getOwnPropertyDescriptor(BaseNoEditableChannel.prototype, name)) throw new Error(`A getter was defined for '${name}'`);
            });
        } finally {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }

    private expectEqual (actual: unknown, expected: unknown, label: string): void {
        if (actual !== expected) throw new Error(`${label}: expected ${String(expected)}, got ${String(actual)}`);
    }
}
