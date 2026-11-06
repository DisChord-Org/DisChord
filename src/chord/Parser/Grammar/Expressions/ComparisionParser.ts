import { ASTNode, BaseNode, ComparisonOperators, TokenType, TokenTypeUnion } from "../../../model/types";
import { BinaryLevelParser } from "./BinaryLevelParser";
import { AditiveParser } from "./AditiveParser";

export class ComparisionParser<T extends string, N extends BaseNode<T>> extends BinaryLevelParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ ...ComparisonOperators ];

    protected readonly operators = ComparisionParser.keywords;

    /** Parses one operand: the level below, AditiveParser. */
    protected operand(): ASTNode<T, N> {
        return this.parent.get(AditiveParser).parse();
    }
}
