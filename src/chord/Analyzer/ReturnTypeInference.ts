import { ASTNode, BaseNode, ReturnNode, TokenType } from "../model/types";
import { isFunctionNode } from "../ast.guards";
import { DataType, PrimitiveDataType, UnionDataType, VoidDataType } from "../model/DataType";
import { CompilationContext } from "../model/CompilationContext";
import { TypeInferrer } from "./TypeInferrer";

/**
 * What one function being walked has returned so far.
 */
interface ReturnFrame {
    /** The function's name, or `undefined` if it declares its return type or is a constructor: nothing is inferred then. */
    readonly name: string | undefined;
    readonly types: DataType[];
    unknown: boolean;
}

/**
 * Infers the return type of the functions that declare none, from what their `devolver`s return, and
 * records it in the `inferredReturns` of the function's signature, where `CallInferrer` reads it:
 *  - a declared return type always wins, and a constructor has none;
 *  - if any `devolver` returns a value of no inferrable type (a parameter without a type, a call to
 *    something unknown, a recursive call...), the type of the function is unknown;
 *  - otherwise it is the type of its values, or the union of them if they differ;
 *  - a `devolver` without a value returns `indefinido`;
 *  - a function with no `devolver` at all is unknown;
 *  - an async function gives the type of the value it resolves to, not a promise.
 * The walk of the tree calls {@link enter} and {@link exit}; what a call to a function infers depends on
 * the others, so the walk is repeated while {@link changed} says a type did.
 */
export class ReturnTypeInference<T extends string, N extends BaseNode<T>> {
    private readonly frames: ReturnFrame[] = [];
    private changedInPass = false;

    constructor (
        private readonly context: CompilationContext<T>,
        private readonly typeInferrer: TypeInferrer<T, N>
    ) {}

    /**
     * Starts a new walk of the tree.
     */
    public beginPass (): void {
        this.frames.length = 0;
        this.changedInPass = false;
    }

    /**
     * @returns {boolean} Whether the walk changed the inferred return type of some function.
     */
    public get changed (): boolean {
        return this.changedInPass;
    }

    /**
     * Opens a frame for a function, or records the value of a `devolver` in the one it belongs to.
     */
    public enter (node: ASTNode<T, N>): void {
        if (isFunctionNode(node)) {
            const infers = !node.returnType && !node.metadata.isConstructor;
            this.frames.push({ name: infers ? node.id : undefined, types: [], unknown: false });
            return;
        }

        if (node.type !== TokenType.Devolver || this.frames.length === 0) return;

        const frame = this.frames[this.frames.length - 1];
        const value = (node as ReturnNode<T, N>).object;
        const type = value ? this.typeInferrer.infer(value) : PrimitiveDataType.Indefinido;

        if (!type || type instanceof VoidDataType) frame.unknown = true;
        else frame.types.push(type);
    }

    /**
     * Closes the frame of a function and records the type it came to, with its scope still open.
     */
    public exit (node: ASTNode<T, N>): void {
        if (!isFunctionNode(node)) return;

        const frame = this.frames.pop();
        if (!frame || frame.name === undefined) return;

        const signature = this.context.symbolTable.lookup(frame.name)?.signature;
        if (!signature) return;

        const inferred = frame.unknown || frame.types.length === 0 ? undefined : UnionDataType.ofTypes(frame.types);

        if (signature.inferredReturns?.format() === inferred?.format()) return;

        signature.inferredReturns = inferred;
        this.changedInPass = true;
    }
}
