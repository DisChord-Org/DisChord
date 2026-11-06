import type { BaseNode } from "./base";
import type { ClassNode, FunctionNode, LoopNode, PropertyNode, VariableNode } from "./declarations";
import type { ConditionNode, ExitLoopNode, PassLoopNode, ReturnNode, ExportNode, ImportNode, AssignmentNode, JSNode, BlockNode, EOF, SOF, ODBNode } from "./statements";
import type { BinaryExpressionNode, LiteralNode, NewNode, NoUnaryNode, UnaryNode, ListNode, ExpressionNode, IdentificatorNode, AccessNode, AccessNodeByIndex, CallNode, SuperNode, ThisNode } from "./expressions";

/**
 * Comprehensive polymorphic union encompassing all valid compilation nodes available inside the Abstract Syntax Tree.
 * @template {string} T - Extensible custom token type bindings vector mapping custom plugins requirements.
 * @template {BaseNode<T>} N - Extensible custom node interface structures injection hooked into higher compiler levels.
 */
export type ASTNode<T extends string, N extends BaseNode<T>> =
    | EOF<T>
    | SOF<T>
    | LiteralNode<T>
    | BinaryExpressionNode<T, N>
    | ConditionNode<T, N>
    | VariableNode<T, N>
    | PropertyNode<T, N>
    | LoopNode<T, N>
    | FunctionNode<T, N>
    | ClassNode<T, N>
    | ExitLoopNode<T>
    | PassLoopNode<T>
    | ReturnNode<T, N>
    | NewNode<T, N>
    | NoUnaryNode<T, N>
    | UnaryNode<T, N>
    | ListNode<T, N>
    | ExpressionNode<T, N>
    | IdentificatorNode<T>
    | AccessNode<T, N>
    | CallNode<T, N>
    | ExportNode<T, N>
    | ImportNode<T>
    | AssignmentNode<T, N>
    | JSNode<T>
    | SuperNode<T>
    | ThisNode<T>
    | AccessNodeByIndex<T, N>
    | ODBNode<T, N>
    | BlockNode<T, N>
    | N;
