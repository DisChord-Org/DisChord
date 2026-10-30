import { eventsMap } from "./Generator/constants/mappings";
import { CommandScopeNames } from "./CommandScopeNames";
import { CommandNode, DisChordASTNode, DisChordTokenType, EventNode } from "./types";

/**
 * The names dischord puts in scope inside a command or an event, in the one place that works them out:
 * for a command, the ones `CommandScopeNames` knows (the handler's parameter, the injected names and
 * the options); for an event, the parameters of its family in `eventsMap`. The analyzer rules that need
 * them (the one that knows the names, the one that rejects declaring them again) read it, so they cannot
 * drift from the tables the generator reads.
 * @class InjectedNames
 */
export class InjectedNames {
    /**
     * The names already worked out, by node: two rules ask for the same owner in one analysis, and the
     * tree is built anew for each, so nothing outlives it.
     */
    private static readonly cache: WeakMap<DisChordASTNode, readonly string[]> = new WeakMap();

    /**
     * @param {DisChordASTNode} owner - A node that owns a scope.
     * @returns {readonly string[]} The names it puts in scope; none if it is not a command or an event.
     */
    public static of (owner: DisChordASTNode): readonly string[] {
        let names = InjectedNames.cache.get(owner);

        if (!names) {
            names = InjectedNames.compute(owner);
            InjectedNames.cache.set(owner, names);
        }

        return names;
    }

    private static compute (owner: DisChordASTNode): readonly string[] {
        if (owner.type === DisChordTokenType.CREAR_COMANDO) return CommandScopeNames.visible((owner as CommandNode).body);

        if (owner.type === DisChordTokenType.EVENTO) return eventsMap[(owner as EventNode).name]?.params ?? [];

        return [];
    }
}
