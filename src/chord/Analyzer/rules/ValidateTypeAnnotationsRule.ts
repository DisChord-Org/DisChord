import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../../walkAST";
import { ASTNode, BaseNode, FunctionNode, TokenType, VariableNode } from "../../types";
import { ArrayDataType, DataType, TupleDataType, UnionDataType, UserClassDataType, VoidDataType } from "../../model/DataType";

import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Checks the names a `tipo` annotation uses, which `TypeAnnotationParser` can't: a class of the
 * user may be declared further down the file, so the parser leaves any unrecognized name as a
 * provisional `UserClassDataType`, and this rule, running once every class is bound, rejects the
 * ones that name no class. It also rejects `nada`, which only makes sense as a return type, anywhere
 * a value's type is written. Today that is a `var`'s annotation, a parameter's and a return type (of functions, methods and constructors). `nada` is
 * valid only as a return type, alone or in a union, never as a parameter or inside a list or tuple.
 *
 * Runs before `ResolveVariableTypesRule`, so an annotation is known to be well-formed by the time
 * it is compared with its initializer.
 */
export class ValidateTypeAnnotationsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => {
            if (current.type === TokenType.Funcion) {
                const fn = current as FunctionNode<T, N>;

                fn.paramTypes?.forEach(type => type && this.validate(type, fn.location, false));
                if (fn.returnType) this.validate(fn.returnType, fn.location, true);
                return;
            }

            if (current.type !== TokenType.VARIABLE) return;

            const variable = current as VariableNode<T, N>;
            if (variable.dataType) this.validate(variable.dataType, variable.location, false);
        }));
    }

    /**
     * @param {DataType} type - A written type, searched through its unions, arrays and tuples.
     * @param {BaseNode<T>['location']} location - Where the annotation is, for the error.
     * @param {boolean} allowsVoid - Whether `nada` is valid here (a return type, or a member of a union that is one).
     * @param {boolean} inContainer - Whether the type is the element of a list or tuple, where `nada` never is.
     * @throws {ChordError} If it names a class that doesn't exist, or uses `nada` where it isn't valid.
     * @private
     */
    private validate (type: DataType, location: BaseNode<T>['location'], allowsVoid: boolean, inContainer = false): void {
        if (type instanceof UserClassDataType && !this.context.symbolTable.classes.isUserClass(type.name)) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: `Tipo desconocido '${type.name}'. Tipos válidos: ${this.context.coreLib.annotableTypeNames()} o una clase declarada en el archivo; también T[], [A, B] y A|B`,
            location
        }).format();

        if (type instanceof VoidDataType && !allowsVoid) throw new ChordError({
            phase: ErrorLevel.Analysis,
            message: inContainer ? `'nada' no puede ser el tipo de los elementos de una lista ni de una tupla` : `'nada' solo puede usarse como tipo de retorno`,
            location
        }).format();

        if (type instanceof UnionDataType) type.members.forEach(member => this.validate(member, location, allowsVoid));
        if (type instanceof ArrayDataType) this.validate(type.element, location, false, true);
        if (type instanceof TupleDataType) type.elements.forEach(element => this.validate(element, location, false, true));
    }
}
