import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../walkAST";
import { ASTNode, BaseNode, ListNode, TokenType, VariableNode } from "../../types";
import { DataType, TupleDataType, VoidDataType } from "../../DataType";
import { TypeInferrer } from "../TypeInferrer";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Pass 3 of the Analyzer's binding model ("Tipos"): resolves and validates each variable's
 * `dataType` now that every declaration from Pass 2 ({@link BindDeclarationsRule}) is already
 * registered in the `SymbolTable`. Runs as its own pass, after binding, rather than being folded
 * into Pass 2 itself, so that a future type check needing to see *other* variables' types (not
 * just the one currently being declared) always finds a fully populated table — the same reason
 * `BindDeclarationsRule` itself is a separate pass from reference validation.
 *
 * A variable's `dataType` is either
 *  - inferred from its initializer (delegated to {@link TypeInferrer} — literals, identifiers
 *    referencing an already-resolved variable, arithmetic/comparison/logical binary expressions,
 *    list literals (recursively combining element types into a union when they differ), and
 *    calls/reads of a core library member, typed by its `returns`),
 *  - validated against an explicit `tipo` annotation, when both are present: the inferred type
 *    must be assignable to the declared one (`tipo (texto|numero)` accepts a `numero`-only value
 *    fine — the annotation only needs to cover what's actually possible), or
 *  - left as-is (the explicit annotation, or `undefined`) when the initializer isn't inferrable at
 *    all — a call to a user function, an index access, a component declaration (embed, comando,
 *    ...), or a function's return value (functions have no declared return type yet).
 *
 * Mirrors `BindDeclarationsRule`'s own traversal: classes and functions get their own lexical
 * scope for their body, entered/exited via `walkAST`'s `exit` hook, so a variable's resolved type
 * lands on the same `SymbolTable` scope entry `BindDeclarationsRule` created for it.
 */
export class ResolveVariableTypesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * Delegate for inferring a `DataType` from an expression — see `TypeInferrer`/`SubInferrer`.
     * @private
     * @readonly
     */
    private readonly typeInferrer: TypeInferrer<T, N> = new TypeInferrer(this.context);

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
     * Resolves a variable's `dataType`. When the annotation is a tuple and the initializer is a
     * list literal, validates it contextually, position by position (see
     * {@link validateTupleLiteral}) — a tuple can never be reached through `TypeInferrer.infer`
     * (only an explicit `tipo [...]` produces one), so the general "infer, then check
     * assignability" path below could never validate one correctly: inferring `[1, "a"]` on its
     * own always yields a flat union array (`numero|texto[]`), not a tuple, and a tuple is never
     * assignable from an array regardless of elements. Otherwise, infers the type from the
     * initializer and, if an explicit `tipo` annotation is also present, checks the inferred type
     * is assignable to it.
     * @param {VariableNode<T, N>} variableNode - The variable declaration to resolve.
     * @returns {DataType | undefined} The resolved type, or `undefined` if neither an annotation
     * nor an inferrable initializer is present.
     * @throws {ChordError} If the explicit `tipo` annotation isn't assignable from the inferred
     * type (or, for a tuple, if the list literal's shape doesn't match it).
     * @private
     */
    private resolveDataType (variableNode: VariableNode<T, N>): DataType | undefined {
        if (variableNode.dataType instanceof TupleDataType && variableNode.value.type === TokenType.LISTA) {
            this.validateTupleLiteral(variableNode.id, variableNode.dataType, variableNode.value as ListNode<T, N>);
            return variableNode.dataType;
        }

        const inferredType = this.typeInferrer.infer(variableNode.value);

        if (inferredType instanceof VoidDataType) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${variableNode.id}' se inicializó con una llamada que no devuelve ningún valor`,
            location: variableNode.location
        }).format();

        if (variableNode.dataType && inferredType && !variableNode.dataType.isAssignableFrom(inferredType)) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${variableNode.id}' se declaró con tipo '${variableNode.dataType.format()}' pero se le asignó un valor de tipo '${inferredType.format()}'`,
            location: variableNode.location
        }).format();

        return variableNode.dataType ?? inferredType;
    }

    /**
     * Validates a list literal against a declared tuple type, position by position: the list must
     * have exactly as many elements as the tuple, and each element's inferred type must be
     * assignable to that position's declared type. Unlike `TypeInferrer.infer` on a list (which
     * infers a single flat union for the whole list), this is *contextual*: it only runs when a
     * `tipo [...]` annotation is already known, the same way TypeScript's checker only checks an
     * array literal against a tuple shape when one is already expected from context, rather than
     * ever inferring a tuple type from the literal on its own.
     * @param {string} id - The variable's name, for the error message.
     * @param {TupleDataType} tupleType - The declared tuple type.
     * @param {ListNode<T, N>} listNode - The list literal assigned to the variable.
     * @throws {ChordError} If the list's length doesn't match the tuple's, or an element's
     * inferred type isn't assignable to its declared position.
     * @private
     */
    private validateTupleLiteral (id: string, tupleType: TupleDataType, listNode: ListNode<T, N>): void {
        if (listNode.body.length !== tupleType.elements.length) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `La variable '${id}' se declaró como tupla de ${tupleType.elements.length} elemento(s) pero se le asignó una lista de ${listNode.body.length}`,
            location: listNode.location
        }).format();

        listNode.body.forEach((element, index) => {
            const elementType = this.typeInferrer.infer(element);
            const expectedType = tupleType.elements[index];

            if (elementType && !expectedType.isAssignableFrom(elementType)) throw new ChordError({
                phase: ErrorLevel.Analysis,
                message: `La variable '${id}' se declaró con tipo '${tupleType.format()}', pero el elemento ${index} es de tipo '${elementType.format()}', se esperaba '${expectedType.format()}'`,
                location: element.location
            }).format();
        });
    }
}
