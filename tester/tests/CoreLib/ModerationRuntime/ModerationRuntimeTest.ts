import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Test } from "../../../Test";
import { moderationModule } from "../../../../src/dischord/corelib";

/**
 * @class ModerationRuntimeTest
 * @description Runs the shared module that holds the barriers of `banear`, `desbanear` and `expulsar`
 * against a fake client, since `seyfert` is not installed in this repository. It is the critical piece
 * of the moderation actions, so the cases try to get round every barrier: ids spelled another way,
 * promises, objects, numbers, a hierarchy that cannot be read, quotas and refusals of Discord.
 * No refused case may reach the client.
 */
export class ModerationRuntimeTest extends Test {
    /**
     * @type {string}
     */
    public readonly name: string = 'Moderation Runtime - Test';

    /**
     * @type {string}
     */
    public readonly description: string = 'It has to refuse every moderation action that skips a barrier before calling the client';

    private file = '';
    private loads = 0;

    /**
     * Not a comparison with a snapshot: it executes the module.
     * @override
     */
    protected override async run (): Promise<void> {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dischord-moderation-'));

        try {
            this.file = path.join(directory, 'moderation.mjs');
            fs.writeFileSync(this.file, moderationModule.content);

            await this.eventActions();
            await this.targets();
            await this.invoker();
            await this.hierarchy();
            await this.quota();
            await this.refusals();
        } finally {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }

    /** A fresh copy of the module, so the quota of one case does not count in another. */
    private async load (): Promise<any> {
        return await import(`${pathToFileURL(this.file).href}?v=${this.loads++}`);
    }

    private world (options: { guilds?: number; members?: Record<string, any>; memberError?: any; banError?: any; botId?: any; ownerId?: any } = {}): any {
        const calls: any[] = [];
        const members = options.members ?? {};

        const client: any = {
            botId: 'botId' in options ? options.botId : '900',
            cache: { guilds: { count: async () => options.guilds ?? 1 } },
            guilds: { fetch: async () => ({ ownerId: 'ownerId' in options ? options.ownerId : '100' }) },
            members: {
                fetch: async (guildId: string, id: string) => {
                    if (options.memberError) throw options.memberError;
                    if (!(id in members)) throw { metadata: { status: 404 } };
                    return members[id];
                },
                kick: async (...args: any[]) => { if (options.banError) throw options.banError; calls.push([ 'kick', ...args ]); }
            },
            bans: {
                create: async (...args: any[]) => { if (options.banError) throw options.banError; calls.push([ 'ban', ...args ]); },
                remove: async (...args: any[]) => { if (options.banError) throw options.banError; calls.push([ 'unban', ...args ]); }
            }
        };

        return { client, calls };
    }

    private member (id: string, position: number, flags: string[] = [ 'BanMembers', 'KickMembers' ]): any {
        return {
            id,
            permissions: { has: (needed: string[]) => needed.every(flag => flags.includes(flag)) },
            roles: { highest: async () => ({ position }) }
        };
    }

    private command (client: any, invoker: any): any {
        return { cliente: client, contexto: { member: invoker, author: { id: invoker.id }, command: { name: 'castiga' } } };
    }

    private async refused (action: () => Promise<unknown>, calls: any[], label: string, expected?: string): Promise<void> {
        let message: string | undefined;
        const before = calls.length;

        try {
            await action();
        } catch (error) {
            message = error instanceof Error ? error.message : String(error);
        }

        if (message === undefined) throw new Error(`${label}: it was not refused`);
        if (expected !== undefined && !message.includes(expected)) throw new Error(`${label}: expected '${expected}' in '${message}'`);
        if (calls.length !== before) throw new Error(`${label}: the client was called after refusing it`);
    }

    private expect (actual: unknown, expected: unknown, label: string): void {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }

    // an event: the bot acts alone
    private async eventActions (): Promise<void> {
        const { banMember, unbanMember, kickMember } = await this.load();
        const { client, calls } = this.world();
        const ctx = { cliente: client };

        await banMember(ctx, '300', '11', 'spam', undefined);
        await banMember(ctx, Promise.resolve({ id: '301' }), Promise.resolve('11'), Promise.resolve('spam'), Promise.resolve(3600));
        await unbanMember(ctx, '300', '11', 'apelación');
        await kickMember(ctx, { id: '302' }, '11', 'spam');

        this.expect(calls[0], [ 'ban', '11', '300', undefined, '[DisChord] evento: spam' ], 'ban by id');
        this.expect(calls[1], [ 'ban', '11', '301', { delete_message_seconds: 3600 }, '[DisChord] evento: spam' ], 'ban by promise and object, seconds');
        this.expect(calls[2], [ 'unban', '11', '300', '[DisChord] evento: apelación' ], 'unban');
        this.expect(calls[3], [ 'kick', '11', '302', '[DisChord] evento: spam' ], 'kick');

        // a canonical id is sent even if it was written with leading zeros
        await banMember(ctx, '000303', '12', 'spam', undefined);
        this.expect(calls[4], [ 'ban', '12', '303', undefined, '[DisChord] evento: spam' ], 'leading zeros');

        // the reason is cut to what Discord keeps
        await banMember(ctx, '304', '13', 'x'.repeat(600), undefined);
        this.expect(calls[5][4].length, 512, 'reason length');

        // what is not an id is refused, whatever it is
        const fresh = this.world();
        const freshCtx = { cliente: fresh.client };
        const { banMember: ban } = await this.load();

        for (const bad of [ undefined, null, '', ' ', 'abc', '12 3', '-5', '1.5', 5, 1e30, true, {}, { id: 5 }, { id: 'x' }, [], Promise.resolve(undefined) ]) {
            await this.refused(() => ban(freshCtx, bad, '11', 'spam', undefined), fresh.calls, `user ${String(bad)}`, 'no es un identificador válido');
        }

        await this.refused(() => ban(freshCtx, '300', undefined, 'spam', undefined), fresh.calls, 'no guild', "'servidor'");
        await this.refused(() => ban(freshCtx, '300', '11', undefined, undefined), fresh.calls, 'no reason', 'Falta la razón');
        await this.refused(() => ban(freshCtx, '300', '11', '   ', undefined), fresh.calls, 'blank reason', 'Falta la razón');
        await this.refused(() => ban(freshCtx, '300', '11', 5, undefined), fresh.calls, 'numeric reason', 'Falta la razón');
        await this.refused(() => ban({}, '300', '11', 'spam', undefined), fresh.calls, 'no client', 'No hay un cliente');

        for (const seconds of [ -1, 604801, 1.5, '3600', NaN, Infinity, null, true ]) {
            await this.refused(() => ban(freshCtx, '300', '11', 'spam', seconds), fresh.calls, `seconds ${String(seconds)}`, "'borrarMensajes'");
        }

        await ban(freshCtx, '300', '11', 'spam', 0);
        await ban(freshCtx, '300', '11', 'spam', 604800);
        this.expect(fresh.calls.length, 2, 'the limits of the range are accepted');
    }

    // the bot and the owner, spelled any way
    private async targets (): Promise<void> {
        for (const action of [ 'banMember', 'kickMember' ]) {
            const module = await this.load();
            const { client, calls } = this.world();
            const ctx = { cliente: client };

            for (const bot of [ '900', '0900', { id: '900' }, Promise.resolve('900'), Promise.resolve({ id: '000900' }) ]) {
                await this.refused(() => module[action](ctx, bot, '11', 'spam'), calls, `${action} bot ${JSON.stringify(bot)}`, 'El bot no puede actuar sobre sí mismo');
            }

            for (const owner of [ '100', '0100', { id: '100' }, Promise.resolve('100') ]) {
                await this.refused(() => module[action](ctx, owner, '11', 'spam'), calls, `${action} owner ${JSON.stringify(owner)}`, 'dueño del servidor');
            }
        }

        // what cannot be told is refused, not let through
        for (const options of [ { botId: undefined }, { botId: 900 }, { ownerId: undefined }, { ownerId: 100 } ]) {
            const module = await this.load();
            const { client, calls } = this.world(options);

            await this.refused(() => module.banMember({ cliente: client }, '300', '11', 'spam'), calls, `unknown ids ${JSON.stringify(options)}`);
        }
    }

    // the command: whoever ran it
    private async invoker (): Promise<void> {
        const module = await this.load();
        const { client, calls } = this.world({ members: { '300': this.member('300', 1) } });
        const moderator = this.member('200', 5);
        const ctx = this.command(client, moderator);

        await module.banMember(ctx, '300', '11', 'spam', undefined);
        this.expect(calls[0], [ 'ban', '11', '300', undefined, '[DisChord] comando castiga por 200: spam' ], 'the reason says who ordered it');

        for (const self of [ '200', '0200', { id: '200' }, Promise.resolve('200') ]) {
            await this.refused(() => module.banMember(ctx, self, '11', 'spam'), calls, `self ${JSON.stringify(self)}`, 'su propio objetivo');
            await this.refused(() => module.kickMember(ctx, self, '11', 'spam'), calls, `self kick ${JSON.stringify(self)}`, 'su propio objetivo');
        }

        // the permission of the action, not any other
        const only = (flags: string[]) => this.command(client, this.member('200', 5, flags));
        const before = calls.length;

        await this.refused(() => module.banMember(only([ 'KickMembers' ]), '300', '11', 'spam'), calls, 'ban without BanMembers', "'Banear miembros'");
        await this.refused(() => module.unbanMember(only([ 'KickMembers' ]), '300', '11', 'spam'), calls, 'unban without BanMembers', "'Banear miembros'");
        await this.refused(() => module.kickMember(only([ 'BanMembers' ]), '300', '11', 'spam'), calls, 'kick without KickMembers', "'Expulsar miembros'");
        await this.refused(() => module.banMember({ cliente: client, contexto: { author: { id: '200' } } }, '300', '11', 'spam'), calls, 'no member in the interaction', 'Solo se puede desde un servidor');

        // the permissions come from the roles when the interaction does not carry them
        const lazy = this.member('200', 5);
        delete lazy.permissions;
        lazy.roles.permissions = async () => ({ has: () => false });
        await this.refused(() => module.banMember(this.command(client, lazy), '300', '11', 'spam'), calls, 'permissions from the roles', "'Banear miembros'");
    }

    // nobody equal to or above whoever ran the command
    private async hierarchy (): Promise<void> {
        const module = await this.load();
        const moderator = this.member('200', 5);

        const members = { '301': this.member('301', 5), '302': this.member('302', 6), '303': this.member('303', 4), '304': this.member('304', 0) };
        const { client, calls } = this.world({ members });
        const ctx = this.command(client, moderator);

        for (const above of [ '301', '302', '0301', { id: '302' }, Promise.resolve('301') ]) {
            await this.refused(() => module.banMember(ctx, above, '11', 'spam'), calls, `ban ${JSON.stringify(above)}`, 'no está por debajo');
            await this.refused(() => module.kickMember(ctx, above, '11', 'spam'), calls, `kick ${JSON.stringify(above)}`, 'no está por debajo');
        }

        await module.banMember(ctx, '303', '11', 'spam');
        await module.kickMember(ctx, '304', '11', 'spam');
        this.expect(calls.map((call: any) => call[0]), [ 'ban', 'kick' ], 'lower roles are allowed');

        // somebody without roles has the lowest position
        const bare = this.world({ members: { '305': { id: '305', roles: { highest: async () => undefined } } } });
        await module.kickMember(this.command(bare.client, moderator), '305', '11', 'spam');
        this.expect(bare.calls.length, 1, 'a member with no roles');

        // somebody who left has no hierarchy to check; any other failure to find out refuses
        const left = this.world({ members: {} });
        await module.banMember(this.command(left.client, moderator), '306', '11', 'spam');
        this.expect(left.calls.length, 1, 'a user who is not a member');

        for (const memberError of [ { metadata: { status: 500 } }, { metadata: { status: 403 } }, new Error('network') ] as any[]) {

            const broken = this.world({ memberError });
            await this.refused(() => module.banMember(this.command(broken.client, moderator), '307', '11', 'spam'), broken.calls, `lookup failing with ${JSON.stringify(memberError.metadata ?? memberError.message)}`, 'jerarquía de roles');
        }

        // the owner of the server may act on anyone below, and nobody else is checked on unban
        const owner = this.member('100', 99);
        const high = this.world({ members: { '308': this.member('308', 500) }, ownerId: '100' });
        await module.kickMember(this.command(high.client, owner), '308', '11', 'spam');
        this.expect(high.calls.length, 1, 'the owner is above the hierarchy');

        const unban = this.world({ members: { '309': this.member('309', 500) } });
        await module.unbanMember(this.command(unban.client, moderator), '309', '11', 'spam');
        this.expect(unban.calls.length, 1, 'unban has no hierarchy');
    }

    private async quota (): Promise<void> {
        const module = await this.load();
        const { client, calls } = this.world();
        const ctx = { cliente: client };

        for (let index = 0; index < 3; index++) await module.banMember(ctx, `30${index}`, '11', 'spam');
        await this.refused(() => module.banMember(ctx, '310', '11', 'spam'), calls, 'fourth ban', 'límite de seguridad de 3');
        await this.refused(() => module.banMember(ctx, Promise.resolve({ id: '311' }), Promise.resolve('11'), 'spam'), calls, 'fourth ban by promise', 'límite de seguridad de 3');

        // actions started at the same time cannot all read the same count
        const racing = await this.load();
        const race = this.world();
        const results = await Promise.allSettled([ 1, 2, 3, 4, 5, 6 ].map(index => racing.banMember({ cliente: race.client }, `50${index}`, '14', 'spam')));
        this.expect(results.filter(result => result.status === 'fulfilled').length, 3, 'concurrent bans');
        this.expect(race.calls.length, 3, 'concurrent bans reach the client');

        // another server and another action have their own count
        await module.banMember(ctx, '313', '12', 'spam');
        for (let index = 0; index < 5; index++) await module.unbanMember(ctx, `32${index}`, '11', 'spam');
        await this.refused(() => module.unbanMember(ctx, '330', '11', 'spam'), calls, 'sixth unban', 'límite de seguridad de 5');
        for (let index = 0; index < 5; index++) await module.kickMember(ctx, `34${index}`, '11', 'spam');
        await this.refused(() => module.kickMember(ctx, '350', '11', 'spam'), calls, 'sixth kick', 'límite de seguridad de 5');

        // a refused action does not use the quota, and a big bot gets more room (up to eight times)
        const big = await this.load();
        const world = this.world({ guilds: 1500 });
        for (let index = 0; index < 24; index++) await big.banMember({ cliente: world.client }, `40${index}`, '11', 'spam');
        await this.refused(() => big.banMember({ cliente: world.client }, '499', '11', 'spam'), world.calls, 'beyond the top tier', 'límite de seguridad de 24');
        this.expect(world.calls.length, 24, 'the top tier allows 24 bans');
    }

    private async refusals (): Promise<void> {
        const module = await this.load();

        const forbidden = this.world({ banError: { metadata: { status: 403 } } });
        await this.refused(() => module.banMember({ cliente: forbidden.client }, '300', '11', 'spam'), forbidden.calls, '403', 'El rol del bot no está por encima');

        const other = new Error('boom');
        const failing = this.world({ banError: other });
        let thrown: unknown;

        try {
            await module.kickMember({ cliente: failing.client }, '300', '11', 'spam');
        } catch (error) {
            thrown = error;
        }

        if (thrown !== other) throw new Error('an error that is not a refusal must reach the caller as it is');
    }
}
