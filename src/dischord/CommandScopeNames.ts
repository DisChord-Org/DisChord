import { TokenType } from "../chord/model/types";
import { CommandContextParameter, CommandScope } from "./Generator/constants/mappings";
import { DisChordODBNode } from "./types";

/**
 * The names a command's body finds in scope, in the one place that works them out: the handler's
 * parameter, the names of `CommandScope`, and the command's options. The analyzer (which validates
 * and knows the names) and the generator (which declares them) both read it, so they cannot drift.
 *
 * An option named like an injected name wins over it, since both can't be declared in the same
 * scope, but only over one nothing else depends on (`usuario`, `canal`): `cliente`, `contexto` and
 * `ctx` are read by other injected names or by the code the compiler emits, so an option cannot take them.
 * @class CommandScopeNames
 */
export class CommandScopeNames {
    /** Names of `CommandScope`, in the order they are declared. */
    private static readonly injected: readonly string[] = Object.keys(CommandScope);

    /**
     * Names the generated code reads besides the other injected ones (the helpers take `ctx`).
     */
    private static readonly usedByGeneratedCode: readonly string[] = [ 'ctx' ];

    /**
     * The names no option may take: the handler's parameter, the ones another injected name is
     * initialized from, and the ones the generated code reads.
     */
    private static readonly protectedNames: ReadonlySet<string> = new Set([
        CommandContextParameter,
        ...CommandScopeNames.usedByGeneratedCode,
        ...CommandScopeNames.injected.filter(name => Object.entries(CommandScope).some(([ other, expression ]) => other !== name && new RegExp(String.raw`\b${name}\b`).test(expression)))
    ]);

    /**
     * @param {DisChordODBNode} commandBody - The body of a command.
     * @returns {string[]} The names of its options, as written.
     */
    public static optionNames (commandBody: DisChordODBNode): string[] {
        const options = commandBody.blocks['opciones'];

        return options?.type === TokenType.BDO ? Object.keys((options as DisChordODBNode).blocks) : [];
    }

    /**
     * @param {DisChordODBNode} commandBody - The body of a command.
     * @returns {string[]} The options named like a name the compiler needs for itself.
     */
    public static collisions (commandBody: DisChordODBNode): string[] {
        return CommandScopeNames.optionNames(commandBody).filter(name => CommandScopeNames.protectedNames.has(name));
    }

    /**
     * @param {DisChordODBNode} commandBody - The body of a command.
     * @returns {string[]} The injected names that are declared in the command: all but the ones an option takes the place of.
     */
    public static declaredInjected (commandBody: DisChordODBNode): string[] {
        const options = CommandScopeNames.optionNames(commandBody);

        return CommandScopeNames.injected.filter(name => !options.includes(name));
    }

    /**
     * @param {DisChordODBNode} commandBody - The body of a command.
     * @returns {string[]} Every name visible in its body: the handler's parameter, the injected names and the options.
     */
    public static visible (commandBody: DisChordODBNode): string[] {
        return [ CommandContextParameter, ...CommandScopeNames.declaredInjected(commandBody), ...CommandScopeNames.optionNames(commandBody) ];
    }
}
