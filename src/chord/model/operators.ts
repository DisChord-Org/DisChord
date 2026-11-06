import { TokenType } from "./tokens";

/**
 * The operators `ArithmeticParser` parses (the higher-precedence arithmetic level, above `AditiveParser`'s
 * `mas`/`menos`).
 * @type {const}
 */
export const MultiplicativeOperators: readonly TokenType[] = [
    TokenType.Por, TokenType.Entre, TokenType.Resto, TokenType.Exponente
] as const;

/**
 * Every binary operator that always produces a JS `number` result regardless of its operands'
 * types — even `"a" - 1` is `NaN`, and `typeof NaN === 'number'` — so `BinaryExpressionInferrer` can
 * infer `numero` for them unconditionally. `mas` (`+`) is deliberately excluded: it concatenates into
 * a string when either operand is one, so it needs operand-aware handling.
 * @type {const}
 */
export const NumericOperators: readonly TokenType[] = [ TokenType.Menos, ...MultiplicativeOperators ] as const;

/**
 * Every binary operator `ComparisionParser` parses — and, since comparison always coerces to
 * `true`/`false`, every one `BinaryExpressionInferrer` infers as `booleano` unconditionally. `y`/`o`
 * (`&&`/`||`) aren't here: JS's short-circuit evaluation returns whichever operand decided the
 * result, not necessarily a boolean.
 * @type {const}
 */
export const ComparisonOperators: readonly TokenType[] = [
    TokenType.Mayor, TokenType.Menor, TokenType.MayorIgual, TokenType.MenorIgual,
    TokenType.Igual, TokenType.IgualTipado, TokenType.NoIgual, TokenType.NoIgualTipado
] as const;

/**
 * Every binary operator: the additive, numeric, comparison and logical ones. After a word they make an
 * expression, so a parser that has to tell an expression from a `clave valor` pair can ask here.
 * @type {const}
 */
const BinaryOperators: readonly TokenType[] = [
    TokenType.Mas, ...NumericOperators, ...ComparisonOperators, TokenType.Y, TokenType.O
] as const;

/**
 * The value tokens `LiteralParser` consumes, and `PrimaryParser` checks to decide to delegate to it.
 * @type {const}
 */
export const LiteralTokens: readonly TokenType[] = [
    TokenType.NUMERO, TokenType.BIGINT, TokenType.BOOLEANO, TokenType.TEXTO, TokenType.Indefinido
] as const;

const isIn = (group: readonly TokenType[]) => {
    const members = new Set<string>(group);
    return (type: string): boolean => members.has(type);
};

/** Whether `type` is one of `NumericOperators`' tokens. */
export const isNumericOperator = isIn(NumericOperators);
/** Whether `type` is one of `ComparisonOperators`' tokens. */
export const isComparisonOperator = isIn(ComparisonOperators);
/** Whether `type` is one of `BinaryOperators`' tokens. */
export const isBinaryOperator = isIn(BinaryOperators);
/** Whether `type` is one of `LiteralTokens`' tokens. */
export const isLiteralToken = isIn(LiteralTokens);
