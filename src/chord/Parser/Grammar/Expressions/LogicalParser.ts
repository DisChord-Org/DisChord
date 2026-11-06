import { ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../model/types";
import { BinaryLevelParser } from "./BinaryLevelParser";
import { ComparisionParser } from "./ComparisionParser";

export class LogicalParser<T extends string, N extends BaseNode<T>> extends BinaryLevelParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Y, TokenType.O ];

    protected readonly operators = LogicalParser.keywords;

    /** Parses one operand: the level below, ComparisionParser. */
    protected operand(): ASTNode<T, N> {
        return this.parent.get(ComparisionParser).parse();
    }
}
