import { ASTNode, BaseNode, LoopNode, PrimitiveType, TokenType } from "../model/types";
import { isRangeCall } from "../ast.guards";
import { ArrayDataType, DataType, PrimitiveDataType, TupleDataType, UnionDataType } from "../model/DataType";
import type { CompilationContext } from "../model/CompilationContext";
import { SubInferrer, SubInferrerClass } from "./SubInferrer";
import { LiteralInferrer } from "./inferrers/LiteralInferrer";
import { IdentifierInferrer } from "./inferrers/IdentifierInferrer";
import { BinaryExpressionInferrer } from "./inferrers/BinaryExpressionInferrer";
import { ListInferrer } from "./inferrers/ListInferrer";
import { CallInferrer } from "./inferrers/CallInferrer";
import { AccessInferrer } from "./inferrers/AccessInferrer";
import { NewInferrer } from "./inferrers/NewInferrer";
import { BDOInferrer } from "./inferrers/BDOInferrer";
import { ThisInferrer } from "./inferrers/ThisInferrer";
import { IndexInferrer } from "./inferrers/IndexInferrer";
import { ExpressionInferrer } from "./inferrers/ExpressionInferrer";
import { UnaryInferrer } from "./inferrers/UnaryInferrer";
import { NoUnaryInferrer } from "./inferrers/NoUnaryInferrer";

/**
 * Dispatches a `DataType` inference request to the `SubInferrer` registered for the node's shape —
 * mirrors `Generator`'s `SubGenerators` registry/`visit` dispatch, applied to type inference instead
 * of code generation. Used by `ResolveVariableTypesRule` (Pass 3) in place of a per-node-type
 * `if`-chain, so a new inferrable node shape is a new `SubInferrer` subclass registered here,
 * instead of another branch added to that rule.
 *
 * Dispatch is a lookup in a `Map` by `triggerToken` (built once), and each `SubInferrer` is created once and
 * reused: they keep no state, so the same instance serves every node. Nothing is cached per node: the
 * `dataType` of a symbol changes between passes (`ResolveVariableTypesRule`), so an inference made before
 * may not hold later. A context has one `TypeInferrer` shared by all its rules (`CompilationContext.inferrer`).
 * @template {string} T - Extensible token type string vector.
 * @template {BaseNode<T>} N - Extensible abstract syntax tree node layout.
 */
export class TypeInferrer<T extends string, N extends BaseNode<T>> {
    /**
     * @param context - The active compilation context (symbol table, project paths, etc.), reached
     * by a `SubInferrer` (e.g. `IdentifierInferrer`) via `this.parent.context`.
     */
    constructor (public readonly context: CompilationContext<T>) {}

    /** The `SubInferrer` of each node type, created on first use. */
    private readonly instances = new Map<string, SubInferrer<T, N>>();

    /**
     * Every inferrable node shape chord knows about, in no particular order (dispatch is a lookup
     * by `triggerToken`, not a sequence).
     * @private
     * @static
     */
    private static readonly SubInferrers: SubInferrerClass<TokenType, BaseNode<TokenType>>[] = [
        LiteralInferrer, IdentifierInferrer, BinaryExpressionInferrer,
        ListInferrer, CallInferrer, AccessInferrer,
        NewInferrer, BDOInferrer, ThisInferrer,
        IndexInferrer, ExpressionInferrer,
        UnaryInferrer, NoUnaryInferrer
    ];

    /** The `SubInferrer` class of each node type. */
    private static readonly byToken = new Map<string, SubInferrerClass<TokenType, BaseNode<TokenType>>>(
        TypeInferrer.SubInferrers.filter(cls => cls.triggerToken !== undefined).map(cls => [ cls.triggerToken as string, cls ])
    );

    /**
     * Infers `node`'s `DataType`, recursively (a `SubInferrer` may call back into this method for
     * its own children — see `BinaryExpressionInferrer`/`ListInferrer`).
     * @param {ASTNode<T, N>} node - The node to infer a type for.
     * @returns {DataType | undefined} The inferred type, or `undefined` if `node`'s shape has no
     * registered `SubInferrer`, or that `SubInferrer` itself couldn't infer one.
     */
    public infer (node: ASTNode<T, N>): DataType | undefined {
        let inferrer = this.instances.get(node.type);

        if (!inferrer) {
            const InferrerClass = TypeInferrer.byToken.get(node.type);
            if (!InferrerClass) return undefined;

            inferrer = new (InferrerClass as unknown as SubInferrerClass<T, N>)(this);
            this.instances.set(node.type, inferrer);
        }

        return inferrer.infer(node);
    }

    /**
     * The type a `para` gives its variable: the element of a list, a number for `rango`, a character
     * (a text) for a text, the keys (texts) of a `bdo`, any of the elements of a tuple.
     * @param {LoopNode<T, N>} loop - The loop.
     * @returns {DataType | undefined} The type, or `undefined` if the iterable gives none.
     */
    public inferLoopVariable (loop: LoopNode<T, N>): DataType | undefined {
        const iterable = loop.iterable;

        if (isRangeCall(iterable)) return PrimitiveDataType.Numero;

        const type = this.infer(iterable);

        if (type instanceof ArrayDataType) return type.element;
        if (type instanceof TupleDataType) return UnionDataType.ofTypes([ ...type.elements ]);
        if (PrimitiveDataType.is(type, PrimitiveType.Texto) || PrimitiveDataType.is(type, PrimitiveType.BDO)) return PrimitiveDataType.Texto;

        return undefined;
    }
}
