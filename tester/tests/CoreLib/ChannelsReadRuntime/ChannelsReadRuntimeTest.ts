import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Test } from "../../../Test";
import { channelsModuleContent } from "../../../../src/dischord/corelib";

type Helpers = {
    getChannel: (ctx: any, channel: any, guild: any) => Promise<any>;
    listChannels: (ctx: any, guild: any, filters: any) => Promise<any[]>;
};

/**
 * @class ChannelsReadRuntimeTest
 * @description Runs the read helpers of the shared `channels` module against a fake Seyfert client:
 * the channel has to belong to the server of the context, and in a command whoever ran it has to be
 * able to see it (`ViewChannel`); an event has no one who ran it. Reads have no quota.
 */
export class ChannelsReadRuntimeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channels Read Runtime - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to refuse reading a channel that goes past the barriers of the runtime module';

    private directory = '';

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        this.directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-channels-read-'));

        try {
            const helpers = await this.load();

            await this.assertGet(helpers);
            await this.assertList(helpers);
        } finally {
            fs.rmSync(this.directory, { recursive: true, force: true });
        }
    }

    private async load (): Promise<Helpers> {
        const file = path.join(this.directory, 'channels.mjs');
        fs.writeFileSync(file, channelsModuleContent);

        return await import(pathToFileURL(file).href) as Helpers;
    }

    /** A channel whose `memberPermissions` says what `viewers` can see. */
    private channel (id: string, guildId: string, extra: any = {}, visible = true): any {
        return { id, guildId, ...extra, memberPermissions: () => ({ has: (needed: string[]) => visible && needed.includes('ViewChannel') }) };
    }

    private client (channels: any[]): any {
        return {
            channels: { fetch: async (id: string) => channels.find(channel => channel.id === id) },
            guilds: { channels: { list: async (guildId: string) => channels.filter(channel => channel.guildId === guildId) } }
        };
    }

    private command (): any {
        return { member: { id: 'm' }, guildId: 'A' };
    }

    private async expectRejection (action: () => Promise<unknown>, fragment: string, label: string): Promise<void> {
        try {
            await action();
        } catch (error) {
            if (!String((error as Error).message).includes(fragment)) {
                throw new Error(`${label}: expected the error to mention '${fragment}', got '${(error as Error).message}'`);
            }

            return;
        }

        throw new Error(`${label}: expected a rejection, but the read went through`);
    }

    private async assertGet ({ getChannel }: Helpers): Promise<void> {
        const cliente = this.client([ this.channel('a-1', 'A'), this.channel('b-1', 'B'), this.channel('a-hidden', 'A', {}, false) ]);

        await this.expectRejection(() => getChannel(undefined, 'a-1', 'A'), 'No hay un cliente', 'no context');
        await this.expectRejection(() => getChannel({ cliente }, undefined, 'A'), "Falta el valor de 'id'", 'no id');
        await this.expectRejection(() => getChannel({ cliente }, 'b-1', 'A'), 'no pertenece al servidor del contexto', 'a channel of another server');
        await this.expectRejection(() => getChannel({ cliente, contexto: this.command() }, 'a-hidden', 'A'), 'no puede ver ese canal', 'a channel the invoker can not see');

        const seen = await getChannel({ cliente, contexto: this.command() }, 'a-1', 'A');
        if (seen.id !== 'a-1') throw new Error('The channel the client fetched was not returned');

        // an event has no one who ran it: nothing to check but the server
        const inEvent = await getChannel({ cliente }, 'a-hidden', 'A');
        if (inEvent.id !== 'a-hidden') throw new Error('An event could not read a channel');

        // with no server expected there is nothing to compare with
        const anyServer = await getChannel({ cliente }, 'b-1', undefined);
        if (anyServer.id !== 'b-1') throw new Error('A read with no expected server was refused');
    }

    private async assertList ({ listChannels }: Helpers): Promise<void> {
        const cliente = this.client([
            this.channel('a-text', 'A', { type: 0, parentId: '9' }),
            this.channel('a-voice', 'A', { type: 2, parentId: '9' }),
            this.channel('a-voice-free', 'A', { type: 2 }),
            this.channel('a-hidden', 'A', { type: 0 }, false),
            this.channel('b-text', 'B', { type: 0 })
        ]);

        await this.expectRejection(() => listChannels({ cliente }, undefined, {}), "Falta el valor de 'servidor'", 'no server');
        await this.expectRejection(() => listChannels(undefined, 'A', {}), 'No hay un cliente', 'no context');

        const ids = (channels: any[]) => channels.map(channel => channel.id).sort().join(',');

        const all = await listChannels({ cliente }, 'A', {});
        if (ids(all) !== 'a-hidden,a-text,a-voice,a-voice-free') throw new Error(`An event should list every channel of the server, got ${ids(all)}`);

        const voices = await listChannels({ cliente }, 'A', { type: 2 });
        if (ids(voices) !== 'a-voice,a-voice-free') throw new Error(`The type filter failed, got ${ids(voices)}`);

        const inCategory = await listChannels({ cliente }, 'A', { type: 2, parent_id: '9' });
        if (ids(inCategory) !== 'a-voice') throw new Error(`The parent filter failed, got ${ids(inCategory)}`);

        const visible = await listChannels({ cliente, contexto: this.command() }, 'A', {});
        if (ids(visible) !== 'a-text,a-voice,a-voice-free') throw new Error(`A command should not list what its invoker can not see, got ${ids(visible)}`);
    }
}
