import { ValidateKnownNamesRule } from "../../../chord/Analyzer/rules/ValidateKnownNamesRule";
import { eventsMap } from "../../Generator/constants/mappings";
import { CommandScopeNames } from "../../CommandScopeNames";
import { CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../types";

/**
 * Chord's `ValidateKnownNamesRule` plus the names dischord puts in scope itself: a command's body finds
 * the names `CommandScopeNames` works out (the handler's parameter, the injected ones and its options), and an event's body
 * finds the parameters of its family (`eventsMap`). They come from the tables the generator reads, so
 * the two cannot drift. These rules run after chord's, so the names cannot be taken from the symbol table.
 */
export class DisChordValidateKnownNamesRule extends ValidateKnownNamesRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    protected override injectedNames (owner: DisChordASTNode): readonly string[] {
        if (owner.type === DisChordTokenType.CREAR_COMANDO) return CommandScopeNames.visible((owner as CommandNode).body);

        if (owner.type === DisChordTokenType.EVENTO) return eventsMap[(owner as EventNode).name]?.params ?? [];

        return [];
    }
}
