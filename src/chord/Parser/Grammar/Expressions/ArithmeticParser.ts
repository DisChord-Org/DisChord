import { ASTNode, BaseNode, MultiplicativeOperators, TokenType, TokenTypeUnion } from "../../../model/types";
import { BinaryLevelParser } from "./BinaryLevelParser";
import { UnaryParser } from "./UnaryParser";

export class ArithmeticParser<T extends string, N extends BaseNode<T>> extends BinaryLevelParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ ...MultiplicativeOperators ];

    protected readonly operators = ArithmeticParser.keywords;

    /** Parses one operand: the level below, UnaryParser. */
    protected operand(): ASTNode<T, N> {
        return this.parent.get(UnaryParser).parse();
    }
}
