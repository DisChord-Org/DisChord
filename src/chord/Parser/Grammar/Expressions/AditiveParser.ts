import { ASTNode, BaseNode, TokenType, TokenTypeUnion } from "../../../model/types";
import { BinaryLevelParser } from "./BinaryLevelParser";
import { ArithmeticParser } from "./ArithmeticParser";

export class AditiveParser<T extends string, N extends BaseNode<T>> extends BinaryLevelParser<T, N> {
    /** To identify when this parser should be used */
    static triggerToken: TokenType | undefined;

    /**
     * Collection of reserved keywords this specific sub-parser registers
     */
    static keywords: TokenTypeUnion<string>[] = [ TokenType.Mas, TokenType.Menos ];

    protected readonly operators = AditiveParser.keywords;

    /** Parses one operand: the level below, ArithmeticParser. */
    protected operand(): ASTNode<T, N> {
        return this.parent.get(ArithmeticParser).parse();
    }
}
