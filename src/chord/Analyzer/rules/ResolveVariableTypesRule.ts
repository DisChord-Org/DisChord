import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, LiteralNode, PrimitiveType, PrimitiveTypeName, TokenType, VariableNode } from "../../types";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Pass 3 of the Analyzer's binding model ("Tipos"): resolves and validates each variable's
 * primitive `dataType` now that every declaration from Pass 2 ({@link BindDeclarationsRule}) is
 * already registered in the `SymbolTable`. Runs as its own pass, after binding, rather than being
 * folded into Pass 2 itself, so that a future type check needing to see *other* variables' types
 * (not just the one currently being declared) always finds a fully populated table — the same
 * reason `BindDeclarationsRule` itself is a separate pass from reference validation.
 *
 * For now this only handles the primitive case: a variable's `dataType` is either
 *  - inferred from its initializer, when that initializer is a literal (`var x es 5` -> `numero`),
 *  - validated against an explicit `tipo` annotation, when both are present and disagree
 *    (`var x tipo texto es 5` is rejected), or
 *  - left as-is (the explicit annotation, or `undefined`) when the initializer isn't a literal —
 *    inferring the type of an arbitrary expression, function return, or component declaration
 *    (embed, comando, ...) is future work, not implemented by this rule.
 *
 * Mirrors `BindDeclarationsRule`'s own traversal: classes and functions get their own lexical
 * scope for their body, entered/exited via `walkAST`'s `exit` hook, so a variable's resolved type
 * lands on the same `SymbolTable` scope entry `BindDeclarationsRule` created for it.
 */
export class ResolveVariableTypesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * Translation table used to infer a variable's {@link PrimitiveTypeName} from a literal
     * initializer's native JS value (`typeof (variableNode.value as LiteralNode<T>).value`). Kept
     * as its own inline, rule-local table — the same self-contained-visitor/rule pattern
     * `BinaryExpressionVisitor.operatorsMap` and `UnaryVisitor.primitiveTypeNames` follow — rather
     * than importing the one `UnaryVisitor` keeps for the runtime `tipo x` operator, since this
     * Analyzer rule has no business depending on a Generator-layer class. `PrimitiveTypeName` is
     * what keeps both copies honest.
     * @private
     * @readonly
     */
    private readonly primitiveTypeNames: Record<string, PrimitiveTypeName> = {
        number: PrimitiveType.Numero,
        string: PrimitiveType.Texto,
        boolean: PrimitiveType.Booleano,
        undefined: PrimitiveType.Indefinido,
        object: PrimitiveType.Objeto
    };

    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.enter(current), current => this.exit(current)));
    }

    /**
     * Mirrors {@link BindDeclarationsRule}'s scope tracking (push on class/function entry) and, for
     * a `VariableNode`, resolves and stores its `dataType` via {@link resolveDataType}.
     * @private
     */
    private enter (node: ASTNode<T, N>): void {
        switch (node.type) {
            case TokenType.Clase:
            case TokenType.Funcion:
                this.context.symbolTable.pushScope();
                break;

            case TokenType.VARIABLE:
                const variableNode = node as VariableNode<T, N>;
                const dataType = this.resolveDataType(variableNode);
                this.context.symbolTable.setDataType(variableNode.id, dataType);
                break;
        }
    }

    /**
     * Mirrors {@link BindDeclarationsRule}'s scope tracking (pop on class/function exit).
     * @private
     */
    private exit (node: ASTNode<T, N>): void {
        if (node.type === TokenType.Clase || node.type === TokenType.Funcion) {
            this.context.symbolTable.popScope();
        }
    }

    /**
     * Resolves a variable's primitive `dataType`: if its initializer is a literal, the type is
     * inferred from the literal's native JS value (via {@link primitiveTypeNames}); if an explicit
     * `tipo` annotation is also present, it must match the inferred type. Non-literal initializers
     * (expressions, calls, component declarations, ...) can't be inferred yet, so only the
     * explicit annotation (if any) is kept.
     * @param {VariableNode<T, N>} variableNode - The variable declaration to resolve.
     * @returns {PrimitiveTypeName | undefined} The resolved primitive type, or `undefined` if
     * neither an annotation nor a literal initializer is present.
     * @throws {ChordError} If the explicit `tipo` annotation contradicts the inferred literal type.
     * @private
     */
    private resolveDataType (variableNode: VariableNode<T, N>): PrimitiveTypeName | undefined {
        const isLiteral = variableNode.value.type === TokenType.LITERAL;
        const inferredType = isLiteral
            ? this.primitiveTypeNames[typeof (variableNode.value as LiteralNode<T>).value]
            : undefined;

        if (variableNode.dataType && inferredType && variableNode.dataType !== inferredType) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${variableNode.id}' se declaró con tipo '${variableNode.dataType}' pero se le asignó un valor de tipo '${inferredType}'`,
            location: variableNode.location
        }).format();

        return variableNode.dataType ?? inferredType;
    }
}
