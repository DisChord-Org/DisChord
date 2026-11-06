import { CollectorNode, DisChordNode, DisChordNodeType, DisChordODBNode, DisChordTokenType } from "../../../types";
import { ODBMode, TokenTypeUnion } from "../../../../chord/model/types";
import { SubParser } from "../../../../chord/Parser/SubParser";
import { PrimaryParser } from "../../../../chord/Parser/Grammar/PrimaryParser/PrimaryParser";
import { BDOParser } from "../../../../chord/Parser/Grammar/BDOParser";

/**
 * The Collector Parser.
 * This class is responsible for parsing interaction collector definitions,
 * which include the collector variable and its pulse bodies.
 */
export default class CollectorParser extends SubParser<DisChordNodeType, DisChordNode> {
    /** To identify when this parser should be used */
    static triggerToken: DisChordNodeType | undefined = DisChordTokenType.Recolector;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<DisChordNodeType>[] = [ DisChordTokenType.Recolector ];

    /**
     * Parses a collector attachment block.
     * Expected structure: `recolector <variable> {...}`. Unlike every other DisChord `nuevo X Y
     * {}` form, this never declares a new name — it attaches behavior to an existing variable.
     * @returns The parsed collector node.
     */
    parse (): CollectorNode {
        this.consume(DisChordTokenType.Recolector);

        const variable = this.parent.get(PrimaryParser).parse();
        const methods = this.parent.get(BDOParser).setMode(ODBMode.Simple).parse() as DisChordODBNode;

        return this.createNode<CollectorNode>({
            type: DisChordTokenType.CREAR_RECOLECTOR,
            variable,
            methods
        });
    }
}