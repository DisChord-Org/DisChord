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
};

/**
 * @class ChannelsQuotaConcurrencyTest
 * @description Fires more channel actions than the quota allows all at once against a fake Seyfert
 * client, the way parallel commands or a `Promise.all` would, and checks that exactly the quota goes
 * through: the quota counter must be read, checked and written without waiting in between.
 */
export class ChannelsQuotaConcurrencyTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Channels Quota Concurrency - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to let through exactly the quota when the actions start at the same time';

    private directory = '';

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        this.directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-channels-quota-'));

        try {
            await this.assertParallel('crear', channelQuota.crear, ({ createChannel }, ctx) => createChannel(ctx, 'A', { name: 'x' }));
            await this.assertParallel('editar', channelQuota.editar, ({ editChannel }, ctx) => editChannel(ctx, 'a-1', { name: 'y' }, 'r', 'A'));
            await this.assertParallel('borrar', channelQuota.borrar, ({ deleteChannel }, ctx) => deleteChannel(ctx, 'a-1', 'r', 'A'));
            await this.assertServersAreIndependent();
        } finally {
            fs.rmSync(this.directory, { recursive: true, force: true });
        }
    }

    /** A fresh instance of the module, so its quota counters start empty. */
    private async load (): Promise<Helpers> {
        const file = path.join(this.directory, `channels-${Math.random().toString(36).slice(2)}.mjs`);
        fs.writeFileSync(file, channelsModule.content);

        return await import(pathToFileURL(file).href) as Helpers;
    }

    private client (): any {
        return {
            cache: { guilds: { count: async () => 1 } },
            guilds: { channels: { create: async () => ({ id: 'new' }) } },
            channels: {
                fetch: async (id: string) => ({ id, guildId: 'A' }),
                edit: async (id: string) => ({ id }),
                delete: async (id: string) => ({ id })
            }
        };
    }

    /** Settles every action at once and counts how many went through. */
    private async launch (total: number, act: () => Promise<unknown>): Promise<{ passed: number; refused: number }> {
        const results = await Promise.allSettled(Array.from({ length: total }, () => act()));
        const refused = results.filter(result => result.status === 'rejected' && String(result.reason?.message).includes('límite de seguridad')).length;
        const passed = results.filter(result => result.status === 'fulfilled').length;

        if (passed + refused !== total) throw new Error('Some action failed for a reason other than the quota');

        return { passed, refused };
    }

    private async assertParallel (action: string, quota: number, run: (helpers: Helpers, ctx: any) => Promise<unknown>): Promise<void> {
        const helpers = await this.load();
        const ctx = { cliente: this.client() };
        const total = quota + 5;

        const { passed, refused } = await this.launch(total, () => run(helpers, ctx));

        if (passed !== quota || refused !== 5) throw new Error(`'${action}': ${total} simultaneous actions with a quota of ${quota} should let ${quota} through and refuse 5, but ${passed} passed and ${refused} were refused`);

        // the allowance is spent: one more is refused
        const extra = await this.launch(1, () => run(helpers, ctx));
        if (extra.passed !== 0) throw new Error(`'${action}': an action past the quota went through`);
    }

    private async assertServersAreIndependent (): Promise<void> {
        const helpers = await this.load();
        const ctx = { cliente: this.client() };
        const total = channelQuota.crear + 5;

        const both = await Promise.all([
            this.launch(total, () => helpers.createChannel(ctx, 'A', { name: 'x' })),
            this.launch(total, () => helpers.createChannel(ctx, 'B', { name: 'x' }))
        ]);

        both.forEach(({ passed }, index) => {
            if (passed !== channelQuota.crear) throw new Error(`Server ${index === 0 ? 'A' : 'B'} should have let ${channelQuota.crear} through, got ${passed}`);
        });
    }
}
