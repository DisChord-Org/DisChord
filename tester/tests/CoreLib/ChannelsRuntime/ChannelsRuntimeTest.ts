import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Test } from "../../../Test";
import { channelsModule, channelQuota, channelQuotaMaxTier, channelQuotaWindowMinutes } from "../../../../src/dischord/corelib";

type Helpers = {
    createChannel: (ctx: any, guild: any, body: any) => Promise<any>;
    editChannel: (ctx: any, channel: any, body: any, reason: any, guild: any) => Promise<any>;
    deleteChannel: (ctx: any, channel: any, reason: any, guild: any) => Promise<any>;
};

/**
 * @class ChannelsRuntimeTest
 * @description Runs the shared `channels` module the generated files import, against a fake
 * Seyfert client: the preventive barriers (the permission of whoever ran a command, the quota per
 * server and how it grows with the number of servers, the channel having to belong to the server
 * of the context) hold at execution time, which no snapshot of the generated code can show.
 */
export class ChannelsRuntimeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channels Runtime - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to refuse a channel action that goes past the barriers of the runtime module';

    private directory = '';
    private loaded = 0;

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        this.directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-channels-'));

        try {
            await this.assertInvokerPermission();
            await this.assertEventsHaveNoInvoker();
            await this.assertQuota();
            await this.assertQuotaGrowsWithServers();
            await this.assertQuotaWindowExpires();
            await this.assertChannelBelongsToGuild();
            await this.assertMissingPieces();
            await this.assertParentIsResolved();
        } finally {
            fs.rmSync(this.directory, { recursive: true, force: true });
        }
    }

    /** A fresh instance of the module, so its quota counters start empty. */
    private async load (): Promise<Helpers> {
        const file = path.join(this.directory, `channels-${this.loaded++}.mjs`);
        fs.writeFileSync(file, channelsModule.content);

        return await import(pathToFileURL(file).href) as Helpers;
    }

    private client (guilds: number, calls: string[] = []): any {
        return {
            cache: { guilds: { count: async () => guilds } },
            guilds: { channels: { create: async (guildId: string, body: any) => { calls.push(`create ${guildId} ${JSON.stringify(body)}`); return { id: 'new' }; } } },
            channels: {
                fetch: async (id: string) => ({ id, guildId: id.startsWith('b-') ? 'B' : 'A' }),
                edit: async (id: string, body: any, options: any) => { calls.push(`edit ${id} ${options.reason}`); return { id }; },
                delete: async (id: string, options: any) => { calls.push(`delete ${id} ${options.reason}`); return { id }; }
            }
        };
    }

    private command (permissions: string[] | undefined, viaRoles = false): any {
        const bits = { has: (needed: string[]) => permissions !== undefined && needed.every(name => permissions.includes(name)) };
        const member = viaRoles ? { roles: { permissions: async () => bits } } : { permissions: bits };

        return { member, guildId: 'A' };
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

        throw new Error(`${label}: expected a rejection, but the action went through`);
    }

    private async assertInvokerPermission (): Promise<void> {
        const { createChannel, deleteChannel } = await this.load();
        const cliente = this.client(1);

        await this.expectRejection(
            () => createChannel({ cliente, contexto: this.command([]) }, 'A', { name: 'x' }),
            'Gestionar canales', 'a member without ManageChannels'
        );

        await this.expectRejection(
            () => deleteChannel({ cliente, contexto: { guildId: 'A' } }, 'a-1', 'r', 'A'),
            'Solo se puede desde un servidor', 'a command with no member'
        );

        await createChannel({ cliente, contexto: this.command(['ManageChannels']) }, 'A', { name: 'x' });
        await createChannel({ cliente, contexto: this.command(['ManageChannels'], true) }, 'A', { name: 'y' });
    }

    private async assertEventsHaveNoInvoker (): Promise<void> {
        const { createChannel } = await this.load();

        // an event has no one who ran it: the permission is checked only inside a command
        await createChannel({ cliente: this.client(1) }, 'A', { name: 'x' });
    }

    private async assertQuota (): Promise<void> {
        const { createChannel, deleteChannel } = await this.load();
        const cliente = this.client(1);
        const context = { cliente };

        for (let created = 0; created < channelQuota.crear; created++) await createChannel(context, 'A', { name: 'x' });

        await this.expectRejection(() => createChannel(context, 'A', { name: 'x' }), 'límite de seguridad', 'one creation past the quota');

        // another server has its own counter, and another action its own
        await createChannel(context, 'B', { name: 'x' });
        await deleteChannel(context, 'a-1', 'r', 'A');

        for (let deleted = 1; deleted < channelQuota.borrar; deleted++) await deleteChannel(context, 'a-1', 'r', 'A');

        await this.expectRejection(() => deleteChannel(context, 'a-1', 'r', 'A'), 'límite de seguridad', 'one deletion past the quota');
    }

    private async assertQuotaGrowsWithServers (): Promise<void> {
        const expectations: [number, number][] = [
            [9, 1], [10, 2], [99, 2], [100, 4], [1000, 8], [1_000_000, 2 ** channelQuotaMaxTier]
        ];

        for (const [servers, multiplier] of expectations) {
            const { createChannel } = await this.load();
            const context = { cliente: this.client(servers) };
            const allowance = channelQuota.crear * multiplier;

            for (let created = 0; created < allowance; created++) await createChannel(context, 'A', { name: 'x' });

            await this.expectRejection(
                () => createChannel(context, 'A', { name: 'x' }),
                'límite de seguridad', `${servers} servers should allow ${allowance} creations, not more`
            );
        }
    }

    private async assertQuotaWindowExpires (): Promise<void> {
        const { createChannel } = await this.load();
        const context = { cliente: this.client(1) };
        const realNow = Date.now;
        let now = realNow.call(Date);

        Date.now = () => now;

        try {
            for (let created = 0; created < channelQuota.crear; created++) await createChannel(context, 'A', { name: 'x' });

            await this.expectRejection(() => createChannel(context, 'A', { name: 'x' }), 'límite de seguridad', 'inside the window');

            now += (channelQuotaWindowMinutes * 60 * 1000) + 1;
            await createChannel(context, 'A', { name: 'x' });
        } finally {
            Date.now = realNow;
        }
    }

    private async assertChannelBelongsToGuild (): Promise<void> {
        const { editChannel, deleteChannel } = await this.load();
        const cliente = this.client(1);
        const context = { cliente };

        await this.expectRejection(
            () => deleteChannel(context, 'b-1', 'r', 'A'),
            'no pertenece al servidor del contexto', 'a channel of another server'
        );
        await this.expectRejection(
            () => editChannel(context, 'b-1', { name: 'x' }, 'r', 'A'),
            'no pertenece al servidor del contexto', 'editing a channel of another server'
        );

        // with no server in the context (an event without one) there is nothing to compare with
        await deleteChannel(context, 'b-1', 'r', undefined);
    }

    private async assertMissingPieces (): Promise<void> {
        const { createChannel, deleteChannel } = await this.load();

        await this.expectRejection(() => createChannel(undefined, 'A', { name: 'x' }), 'No hay un cliente', 'no context');
        await this.expectRejection(() => createChannel({ cliente: this.client(1) }, undefined, { name: 'x' }), "Falta el valor de 'servidor'", 'no server');
        await this.expectRejection(() => deleteChannel({ cliente: this.client(1) }, undefined, 'r', 'A'), "Falta el valor de 'canal'", 'no channel');
    }

    private async assertParentIsResolved (): Promise<void> {
        const { createChannel } = await this.load();
        const calls: string[] = [];
        const context = { cliente: this.client(1, calls) };

        await createChannel(context, Promise.resolve({ id: 'A' }), { name: 'x', parent_id: Promise.resolve({ id: 'cat' }) });

        if (!calls[0].includes('"parent_id":"cat"')) throw new Error(`The category was not resolved to its id: ${calls[0]}`);
    }
}
