import { SubParserClass } from "../../../chord/Parser/SubParser";
import { ChannelAction, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import ChannelActionParser from "./features/ChannelActionParser";

/**
 * A single unreserved-keyword action: the verbs that start it, the word that must follow, and the
 * `SubParser` that parses its `{ ... }` block. Unlike a component declaration, an action has no
 * name of its own (`<verbo> <objeto> { ... }`) and performs something where it is written.
 */
export interface UnreservedAction {
    verbs: string[];
    object: string;
    ParserClass: SubParserClass<DisChordNodeType, DisChordNode>;
}

/**
 * Every unreserved-keyword action DisChord recognizes. The single source of truth
 * `DisChordParser.parseCustomStatement` dispatches from — a new action (`expulsar miembro { ... }`)
 * is a row here, not a branch there.
 */
export const UnreservedActions: UnreservedAction[] = [
    {
        verbs: Object.values(ChannelAction),
        object: DisChordTokenType.Canal,
        ParserClass: ChannelActionParser
    }
];
