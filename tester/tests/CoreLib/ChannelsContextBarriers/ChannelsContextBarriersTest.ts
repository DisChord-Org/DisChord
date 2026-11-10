import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Test } from "../../../Test";
import { channelsModule, channelQuota } from "../../../../src/dischord/corelib";

type Helpers = {
    createChannel: (ctx: any, guild: any, body: any) => Promise<any>;
    editChannel: (ctx: any, channel: any, body: any, reason: any, guild: any) => Promise<any>;
    deleteChannel: (ctx: any, channel: any, reason: any, guild: any) => Promise<any>;
    getChannel: (ctx: any, channel: any, guild: any, name?: any, filters?: any) => Promise<any>;
    listChannels: (ctx: any, guild: any, filters?: any) => Promise<any>;
};

/**
 * @class ChannelsContextBarriersTest
 * @description Runs the shared `channels` module against a fake client for the barriers that depend on
 * where and by whom an action is ordered: inside a command the server given has to be the one the
 * command runs in, `editar` and `borrar` need a channel whoever ran the command can see, the audit log
 * says who ordered the action, and the same server written with leading zeros shares one quota.
 * No refused case may reach the client.
 */
export class ChannelsContextBarriersTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channels Context Barriers - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to keep a channel action inside the server of the command, on channels its invoker sees, with the invoker in the audit log';

    private directory = '';
    private loaded = 0;

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        this.directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-channels-context-'));

        try {
            await this.assertServerOfTheContext();
            await this.assertInvokerSeesTheChannel();
            await this.assertAuditReason();
            await this.assertSpellingsShareOneQuota();
        } finally {
            fs.rmSync(this.directory, { recursive: true, force: true });
        }
    }

    private async load (): Promise<Helpers> {
        const file = path.join(this.directory, `channels-${this.loaded++}.mjs`);
        fs.writeFileSync(file, channelsModule.content);

        return await import(pathToFileURL(file).href) as Helpers;
    }

    /** A channel that `viewers` can or can not see, in a server written as given. */
    private channel (id: string, guildId: string, visible = true): any {
        return { id, guildId, memberPermissions: () => ({ has: (needed: string[]) => visible && needed.includes('ViewChannel') }) };
    }

    private client (channels: any[], calls: string[] = [], guilds = 1): any {
        return {
            cache: { guilds: { count: async () => guilds } },
            guilds: { channels: {
                create: async (guildId: string) => { calls.push(`create ${guildId}`); return { id: 'new' }; },
                list: async (guildId: string) => { calls.push(`list ${guildId}`); return channels.filter(channel => channel.guildId === guildId); }
            } },
            channels: {
                fetch: async (id: string) => { calls.push(`fetch ${id}`); return channels.find(channel => channel.id === id); },
                edit: async (id: string, body: any, options: any) => { calls.push(`edit ${id} ${options.reason}`); return { id }; },
                delete: async (id: string, options: any) => { calls.push(`delete ${id} ${options.reason}`); return { id }; }
            }
        };
    }

    private command (guildId: string | undefined = '11', manage = true): any {
        const bits = { has: (needed: string[]) => manage && needed.every(name => name === 'ManageChannels') };

        return { member: { id: '200', permissions: bits }, author: { id: '200' }, guildId, command: { name: 'castiga' } };
    }

    private async refused (action: () => Promise<unknown>, calls: string[], fragment: string, label: string): Promise<void> {
        const before = calls.filter(call => !call.startsWith('fetch')).length;
        let message: string | undefined;

        try {
            await action();
        } catch (error) {
            message = String((error as Error).message);
        }

        if (message === undefined) throw new Error(`${label}: expected a rejection, but the action went through`);
        if (!message.includes(fragment)) throw new Error(`${label}: expected '${fragment}', got '${message}'`);
        if (calls.filter(call => !call.startsWith('fetch')).length !== before) throw new Error(`${label}: the client acted after refusing it`);
    }

    private expect (actual: unknown, expected: unknown, label: string): void {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }

    // the permission of whoever ran the command was looked at in the server the command runs in
    private async assertServerOfTheContext (): Promise<void> {
        const helpers = await this.load();
        const calls: string[] = [];
        const channels = [ this.channel('21', '11'), this.channel('22', '12') ];
        const cliente = this.client(channels, calls);
        const ctx = { cliente, contexto: this.command() };
        const message = 'El servidor indicado no es el del contexto';

        for (const other of [ '12', Promise.resolve('12'), { id: '12' }, '012' ]) {
            await this.refused(() => helpers.createChannel(ctx, other, { name: 'x' }), calls, message, `crear in ${JSON.stringify(other)}`);
            await this.refused(() => helpers.listChannels(ctx, other, {}), calls, message, `listar in ${JSON.stringify(other)}`);
            await this.refused(() => helpers.getChannel(ctx, '21', other), calls, message, `obtener by id in ${JSON.stringify(other)}`);
            await this.refused(() => helpers.getChannel(ctx, undefined, other, 'x'), calls, 'no pertenece al servidor del contexto', `obtener by name in ${JSON.stringify(other)}`);
            await this.refused(() => helpers.editChannel(ctx, '21', { name: 'x' }, 'r', other), calls, 'no pertenece al servidor del contexto', `editar naming ${JSON.stringify(other)}`);
            await this.refused(() => helpers.deleteChannel(ctx, '21', 'r', other), calls, 'no pertenece al servidor del contexto', `borrar naming ${JSON.stringify(other)}`);
        }

        // a channel of another server, whatever server is named
        await this.refused(() => helpers.editChannel(ctx, '22', { name: 'x' }, 'r', '11'), calls, 'no pertenece al servidor del contexto', 'editar a channel of another server');
        await this.refused(() => helpers.deleteChannel(ctx, '22', 'r', undefined), calls, 'no pertenece al servidor del contexto', 'borrar with no server named');

        // a command that carries no server (a direct message) is refused, not let through
        const noServer = this.command();
        delete noServer.guildId;
        const bare = { cliente, contexto: noServer };
        await this.refused(() => helpers.createChannel(bare, '11', { name: 'x' }), calls, message, 'crear without a server in the command');
        await this.refused(() => helpers.listChannels(bare, '11', {}), calls, message, 'listar without a server in the command');

        // the server of the context in any spelling is the server of the context
        await helpers.createChannel(ctx, '011', { name: 'x' });
        await helpers.listChannels(ctx, Promise.resolve({ id: '0011' }), {});
        this.expect(calls.filter(call => call.startsWith('create') || call.startsWith('list')), [ 'create 11', 'list 11' ], 'the canonical id is the one sent');

        // an event has no server of its own to compare with
        await helpers.createChannel({ cliente }, '12', { name: 'x' });
    }

    private async assertInvokerSeesTheChannel (): Promise<void> {
        const helpers = await this.load();
        const calls: string[] = [];
        const cliente = this.client([ this.channel('21', '11'), this.channel('23', '11', false) ], calls);
        const ctx = { cliente, contexto: this.command() };

        await this.refused(() => helpers.editChannel(ctx, '23', { name: 'x' }, 'r', '11'), calls, 'no puede ver ese canal', 'editar a hidden channel');
        await this.refused(() => helpers.deleteChannel(ctx, '23', 'r', '11'), calls, 'no puede ver ese canal', 'borrar a hidden channel');
        await this.refused(() => helpers.deleteChannel(ctx, Promise.resolve({ id: '23' }), 'r', '11'), calls, 'no puede ver ese canal', 'borrar a hidden channel by promise');

        await helpers.editChannel(ctx, '21', { name: 'x' }, 'r', '11');
        await helpers.deleteChannel(ctx, '21', 'r', '11');
        this.expect(calls.filter(call => !call.startsWith('fetch')).length, 2, 'a channel the invoker sees is acted on');

        // an event has no invoker whose view to respect
        await helpers.deleteChannel({ cliente }, '23', 'r', '11');
    }

    private async assertAuditReason (): Promise<void> {
        const helpers = await this.load();
        const calls: string[] = [];
        const cliente = this.client([ this.channel('21', '11') ], calls);
        const ctx = { cliente, contexto: this.command() };

        await helpers.editChannel(ctx, '21', { name: 'x' }, 'limpieza', '11');
        await helpers.deleteChannel(ctx, '21', Promise.resolve('limpieza'), '11');
        await helpers.editChannel(ctx, '21', { name: 'x' }, undefined, '11');
        await helpers.deleteChannel({ cliente }, '21', 'limpieza', '11');
        await helpers.editChannel({ cliente }, '21', { name: 'x' }, undefined, '11');

        const acted = calls.filter(call => !call.startsWith('fetch'));

        this.expect(acted[0], 'edit 21 [DisChord] comando castiga por 200: limpieza', 'editar says who ordered it');
        this.expect(acted[1], 'delete 21 [DisChord] comando castiga por 200: limpieza', 'borrar says who ordered it');
        this.expect(acted[2], 'edit 21 [DisChord] comando castiga por 200', 'editar with no reason still says who');
        this.expect(acted[3], 'delete 21 [DisChord] evento: limpieza', 'an event says so');
        this.expect(acted[4], 'edit 21 [DisChord] evento', 'an event with no reason');

        await helpers.deleteChannel(ctx, '21', 'x'.repeat(600), '11');
        const long = calls.filter(call => call.startsWith('delete')).pop()!.replace('delete 21 ', '');
        this.expect(long.length, 512, 'the reason is cut to what Discord keeps');
    }

    // the same server written four ways is one server for the quota
    private async assertSpellingsShareOneQuota (): Promise<void> {
        const helpers = await this.load();
        const calls: string[] = [];
        const cliente = this.client([ this.channel('21', '011'), this.channel('22', '0011') ], calls);
        const ctx = { cliente };
        const spellings = [ '11', '011', { id: '0011' }, Promise.resolve('00011') ];

        for (let created = 0; created < channelQuota.crear; created++) await helpers.createChannel(ctx, spellings[created % spellings.length], { name: 'x' });

        for (const spelling of spellings) {
            await this.refused(() => helpers.createChannel(ctx, spelling, { name: 'x' }), calls, 'límite de seguridad', `crear in ${JSON.stringify(spelling)} past the quota`);
        }

        // the server of a channel counts as well, spelled as the API gave it
        for (let deleted = 0; deleted < channelQuota.borrar; deleted++) await helpers.deleteChannel(ctx, deleted % 2 ? '21' : '22', 'r', '11');
        await this.refused(() => helpers.deleteChannel(ctx, '21', 'r', '011'), calls, 'límite de seguridad', 'borrar past the quota');
        await this.refused(() => helpers.deleteChannel(ctx, '22', 'r', undefined), calls, 'límite de seguridad', 'borrar past the quota, with no server named');
    }
}
