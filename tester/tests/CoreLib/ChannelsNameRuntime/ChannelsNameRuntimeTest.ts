import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Test } from "../../../Test";
import { channelsModule } from "../../../../src/dischord/corelib";

type Helpers = {
    getChannel: (ctx: any, channel: any, guild: any, name?: any, filters?: any) => Promise<any>;
    listChannels: (ctx: any, guild: any, filters: any) => Promise<any[]>;
};

/**
 * @class ChannelsNameRuntimeTest
 * @description Runs the search of a channel by name of the shared `channels` module against a fake
 * Seyfert client: exactly one channel has to match, what whoever ran a command can not see is left
 * out before counting (so neither the error nor the result tells that it exists), and the barriers of
 * the other reads still hold.
 */
export class ChannelsNameRuntimeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channels Name Runtime - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to find a channel by name only when one is left, and never through a barrier';

    private directory = '';

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        this.directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-channels-name-'));

        try {
            const helpers = await this.load();

            await this.assertSearch(helpers);
            await this.assertVisibility(helpers);
            await this.assertBarriers(helpers);
            await this.assertList(helpers);
        } finally {
            fs.rmSync(this.directory, { recursive: true, force: true });
        }
    }

    private async load (): Promise<Helpers> {
        const file = path.join(this.directory, 'channels.mjs');
        fs.writeFileSync(file, channelsModule.content);

        return await import(pathToFileURL(file).href) as Helpers;
    }

    private channel (id: string, guildId: string, name: string, extra: any = {}, visible = true): any {
        return { id, guildId, name, ...extra, memberPermissions: () => ({ has: (needed: string[]) => visible && needed.includes('ViewChannel') }) };
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

    private async assertSearch ({ getChannel }: Helpers): Promise<void> {
        const cliente = this.client([
            this.channel('text-1', 'A', 'General', { type: 0, parentId: '9' }),
            this.channel('voice-1', 'A', 'general', { type: 2, parentId: '8' }),
            this.channel('lonely', 'A', 'Anuncios', { type: 0 }),
            this.channel('other-server', 'B', 'Anuncios', { type: 0 })
        ]);

        // none
        await this.expectRejection(() => getChannel({ cliente }, undefined, 'A', 'inexistente', {}), "No hay ningún canal llamado 'inexistente'", 'none');

        // one, whatever its case, and not the one of another server
        const one = await getChannel({ cliente }, undefined, 'A', 'ANUNCIOS', {});
        if (one.id !== 'lonely') throw new Error(`A name should match whatever its case and only in the server, got ${one.id}`);

        // two: an error that says how to narrow it, never "the first"
        await this.expectRejection(() => getChannel({ cliente }, undefined, 'A', 'general', {}), "Hay 2 canales llamados 'general'; precisa con 'categoria' o 'tipo'", 'two');

        // ... which type and category narrow, the category also as a promise of a channel
        const byType = await getChannel({ cliente }, undefined, 'A', 'general', { type: 2 });
        if (byType.id !== 'voice-1') throw new Error('The type did not narrow the search');

        const byCategory = await getChannel({ cliente }, undefined, 'A', 'general', { parent_id: Promise.resolve({ id: '9' }) });
        if (byCategory.id !== 'text-1') throw new Error('The category, given as a promise of a channel, did not narrow the search');

        // the server and the name as an object or a promise, as every other helper takes them
        const asPromises = await getChannel({ cliente }, undefined, Promise.resolve({ id: 'A' }), Promise.resolve('anuncios'), {});
        if (asPromises.id !== 'lonely') throw new Error('The server and the name should accept a promise');

        await this.expectRejection(() => getChannel({ cliente }, undefined, undefined, 'anuncios', {}), "Falta el valor de 'servidor'", 'no server');
        await this.expectRejection(() => getChannel(undefined, undefined, 'A', 'anuncios', {}), 'No hay un cliente', 'no client');

        // no name: the read by id is the one it always was
        const byId = await getChannel({ cliente }, 'lonely', 'A');
        if (byId.id !== 'lonely') throw new Error('The read by id changed');
    }

    private async assertVisibility ({ getChannel }: Helpers): Promise<void> {
        const cliente = this.client([
            this.channel('public', 'A', 'staff', { type: 0 }, true),
            this.channel('secret', 'A', 'staff', { type: 0, parentId: '7' }, false),
            this.channel('only-secret', 'A', 'private', { type: 0 }, false)
        ]);
        const ctx = { cliente, contexto: this.command() };

        // the hidden duplicate is not counted, so it can not turn the answer into "there are 2"
        const found = await getChannel(ctx, undefined, 'A', 'staff', {});
        if (found.id !== 'public') throw new Error(`A command should find the channel it can see, got ${found.id}`);

        // a name only a hidden channel has answers exactly as one nobody has
        let hidden = '';
        let missing = '';

        try { await getChannel(ctx, undefined, 'A', 'private', {}); } catch (error) { hidden = (error as Error).message.replace('private', 'x'); }
        try { await getChannel(ctx, undefined, 'A', 'nadie', {}); } catch (error) { missing = (error as Error).message.replace('nadie', 'x'); }

        if (!hidden || hidden !== missing) throw new Error(`A channel the invoker can not see should answer like one that does not exist, got '${hidden}' and '${missing}'`);

        // the same search from an event has no one whose view to respect
        await this.expectRejection(() => getChannel({ cliente }, undefined, 'A', 'staff', {}), 'Hay 2 canales', 'an event sees both');
        const fromEvent = await getChannel({ cliente }, undefined, 'A', 'private', {});
        if (fromEvent.id !== 'only-secret') throw new Error('An event could not find a channel');
    }

    private async assertBarriers ({ getChannel }: Helpers): Promise<void> {
        const cliente = this.client([
            this.channel('a-1', 'A', 'sala', { type: 0 }),
            this.channel('b-1', 'B', 'sala', { type: 0 })
        ]);

        // inside a command only the server of the command is searched
        await this.expectRejection(() => getChannel({ cliente, contexto: this.command() }, undefined, 'B', 'sala', {}), 'no pertenece al servidor del contexto', 'another server from a command');

        // a command without a member has nothing to see with
        await this.expectRejection(() => getChannel({ cliente, contexto: { guildId: 'A' } }, undefined, 'A', 'sala', {}), "No hay ningún canal llamado 'sala'", 'no member');

        // a channel without the means to check permissions is not visible either
        const blind = this.client([ { id: 'x', guildId: 'A', name: 'ciego', type: 0 } ]);
        await this.expectRejection(() => getChannel({ cliente: blind, contexto: this.command() }, undefined, 'A', 'ciego', {}), "No hay ningún canal llamado 'ciego'", 'no memberPermissions');

        // the permission to look is ViewChannel, whatever else a channel grants
        const other = this.client([ { id: 'y', guildId: 'A', name: 'otro', type: 0, memberPermissions: () => ({ has: (needed: string[]) => !needed.includes('ViewChannel') }) } ]);
        await this.expectRejection(() => getChannel({ cliente: other, contexto: this.command() }, undefined, 'A', 'otro', {}), "No hay ningún canal llamado 'otro'", 'without ViewChannel');
    }

    private async assertList ({ listChannels }: Helpers): Promise<void> {
        const cliente = this.client([
            this.channel('t1', 'A', 'ticket-1', { type: 0 }),
            this.channel('t2', 'A', 'Ticket-2', { type: 0 }),
            this.channel('t3', 'A', 'ticket-3', { type: 0 }, false),
            this.channel('g', 'A', 'General', { type: 0 }),
            this.channel('v', 'A', 'ticket-voz', { type: 2 })
        ]);

        const ids = (channels: any[]) => channels.map(channel => channel.id).sort().join(',');

        const exact = await listChannels({ cliente }, 'A', { name: 'general' });
        if (ids(exact) !== 'g') throw new Error(`The name filter should be exact and ignore case, got ${ids(exact)}`);

        const part = await listChannels({ cliente }, 'A', { nameContains: 'TICKET-' });
        if (ids(part) !== 't1,t2,t3,v') throw new Error(`The nameContains filter failed, got ${ids(part)}`);

        const text = await listChannels({ cliente }, 'A', { nameContains: 'ticket-', type: 0 });
        if (ids(text) !== 't1,t2,t3') throw new Error(`The filters should combine, got ${ids(text)}`);

        const visible = await listChannels({ cliente, contexto: this.command() }, 'A', { nameContains: 'ticket-', type: 0 });
        if (ids(visible) !== 't1,t2') throw new Error(`A command should not list what its invoker can not see, got ${ids(visible)}`);
    }
}
