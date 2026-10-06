import { ASTNode, BaseNode, TokenType } from "../types";
import { DataType } from "../DataType";
import { CompilationContext } from "../../cli/commands/CompileCommand";
import { SubInferrerClass } from "./SubInferrer";
import { LiteralInferrer } from "./inferrers/LiteralInferrer";
import { IdentifierInferrer } from "./inferrers/IdentifierInferrer";
import { BinaryExpressionInferrer } from "./inferrers/BinaryExpressionInferrer";
import { ListInferrer } from "./inferrers/ListInferrer";
import { CallInferrer } from "./inferrers/CallInferrer";
import { AccessInferrer } from "./inferrers/AccessInferrer";
import { NewInferrer } from "./inferrers/NewInferrer";

/**
 * Dispatches a `DataType` inference request to the `SubInferrer` registered for the node's shape —
 * mirrors `Generator`'s `SubGenerators` registry/`visit` dispatch, applied to type inference instead
 * of code generation. Used by `ResolveVariableTypesRule` (Pass 3) in place of a per-node-type
 * `if`-chain, so a new inferrable node shape is a new `SubInferrer` subclass registered here,
 * instead of another branch added to that rule.
 *
 * Unlike `GeneratorContext`, this doesn't cache `SubInferrer` instances: inference runs over a
 * handful of nodes once per variable declaration during a single Analyzer pass, not repeatedly
 * over the whole tree the way generation does, so a fresh instance per dispatch is cheap and needs
 * no IoC-style instance registry.
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class TypeInferrer<T extends string, N extends BaseNode<T>> {
    /**
     * @param context - The active compilation context (symbol table, project paths, etc.), reached
     * by a `SubInferrer` (e.g. `IdentifierInferrer`) via `this.parent.context`.
     */
    constructor (public readonly context: CompilationContext<T>) {}

    /**
     * Every inferrable node shape chord knows about, in no particular order (dispatch is a lookup
     * by `triggerToken`, not a sequence).
     * @private
     * @static
     */
    private static readonly SubInferrers: SubInferrerClass<TokenType, BaseNode<TokenType>>[] = [
        LiteralInferrer, IdentifierInferrer, BinaryExpressionInferrer, ListInferrer, CallInferrer, AccessInferrer, NewInferrer
    ];

    /**
     * Infers `node`'s `DataType`, recursively (a `SubInferrer` may call back into this method for
     * its own children — see `BinaryExpressionInferrer`/`ListInferrer`).
     * @param {ASTNode<T, N>} node - The node to infer a type for.
     * @returns {DataType | undefined} The inferred type, or `undefined` if `node`'s shape has no
     * registered `SubInferrer`, or that `SubInferrer` itself couldn't infer one.
     */
    public infer (node: ASTNode<T, N>): DataType | undefined {
        const InferrerClass = TypeInferrer.SubInferrers.find(cls => cls.triggerToken === node.type);
        if (!InferrerClass) return undefined;

        return new (InferrerClass as unknown as SubInferrerClass<T, N>)(this).infer(node);
    }
}
