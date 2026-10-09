import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../../walkAST";
import { ASTNode, BaseNode, ClassNode, FunctionNode, TokenType } from "../../types";
import { isFunctionNode } from "../../ast.guards";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Checks the `extiende` chains between classes of the file: a class can't inherit from itself, directly
 * or through others (`A → B → A`), and its parent must be declared before it, since the generated
 * JavaScript class would otherwise extend something not yet defined. A method that overrides another
 * can't change whether it is `@asincrono`. A parent that is not a class of
 * this file (one dischord generates, a JavaScript global such as `Error`) is not checked.
 *
 * Classes are known by name and ordered by their position in the tree, so two classes with the same
 * name count as the first of them, wherever they are declared.
 */
export class ValidateClassHierarchyRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        const classes: ClassNode<T, N>[] = [];

        nodes.forEach(node => walkAST<T, N>(node, current => {
            if (current.type === TokenType.Clase) classes.push(current as ClassNode<T, N>);
        }));

        const firstPosition = new Map<string, number>();
        classes.forEach((node, position) => {
            if (!firstPosition.has(node.id)) firstPosition.set(node.id, position);
        });

        classes.forEach((node, position) => {
            if (node.superClass === undefined) return;

            const cycle = this.cycleThrough(node);
            if (cycle) this.fail(`La clase '${node.id}' hereda de sí misma (${cycle.join(' → ')})`, node);

            const parentPosition = firstPosition.get(node.superClass);
            if (parentPosition !== undefined && parentPosition > position) {
                this.fail(`La clase '${node.id}' extiende de '${node.superClass}', que se declara más abajo; declara '${node.superClass}' antes de '${node.id}'`, node);
            }
        });

        this.checkOverrides(classes);
    }

    /**
     * A method that overrides another must keep its asynchrony: a call through the base class's type
     * is awaited, or not, by what the base declares, so an override that changes it would be called the
     * wrong way. Each instance method (not a static one nor a constructor) is compared with the one of
     * the same name in the nearest ancestor of the file that declares one.
     * @throws {ChordError} If an override is async and the method it overrides isn't, or the reverse.
     * @private
     */
    private checkOverrides (classes: ClassNode<T, N>[]): void {
        const methodsOf = new Map<string, Map<string, FunctionNode<T, N>>>();

        classes.forEach(node => {
            if (methodsOf.has(node.id)) return;

            const methods = new Map<string, FunctionNode<T, N>>();
            node.body.filter(isFunctionNode).forEach(method => {
                if (!method.metadata.isConstructor && !method.metadata.isStatic) methods.set(method.id, method);
            });

            methodsOf.set(node.id, methods);
        });

        classes.forEach(node => {
            if (node.superClass === undefined) return;

            node.body.filter(isFunctionNode).forEach(method => {
                if (method.metadata.isConstructor || method.metadata.isStatic) return;

                const overridden = this.nearestAncestorMethod(node.superClass!, method.id, methodsOf);
                if (!overridden || !!overridden.method.metadata.isAsync === !!method.metadata.isAsync) return;

                this.fail(
                    method.metadata.isAsync
                        ? `El método '${method.id}' de '${node.id}' es asíncrono pero el de '${overridden.owner}' no`
                        : `El método '${method.id}' de '${node.id}' no es asíncrono pero el de '${overridden.owner}' sí`,
                    method
                );
            });
        });
    }

    /**
     * @returns The method named `name` in `className` or the nearest class it extends that declares one,
     * with the class that declares it. A parent that isn't a class of the file ends the search, and a
     * cycle is cut.
     * @private
     */
    private nearestAncestorMethod (className: string, name: string, methodsOf: Map<string, Map<string, FunctionNode<T, N>>>): { owner: string; method: FunctionNode<T, N> } | undefined {
        const registry = this.context.symbolTable.classes;
        const seen = new Set<string>();
        let current: string | undefined = className;

        while (current !== undefined && !seen.has(current) && registry.isUserClass(current)) {
            seen.add(current);

            const method = methodsOf.get(current)?.get(name);
            if (method) return { owner: current, method };

            current = registry.superClassOf(current);
        }

        return undefined;
    }

    /**
     * @returns The chain of names from the class back to itself (`A`, `B`, `A`) if following its parents
     * returns to it, or `undefined` if the chain ends or enters a cycle that doesn't include it.
     * @private
     */
    private cycleThrough (node: ClassNode<T, N>): string[] | undefined {
        const registry = this.context.symbolTable.classes;
        const chain = [ node.id ];
        const seen = new Set<string>([ node.id ]);
        let current = registry.superClassOf(node.id);

        while (current !== undefined && registry.isUserClass(current)) {
            chain.push(current);
            if (current === node.id) return chain;
            if (seen.has(current)) return undefined;

            seen.add(current);
            current = registry.superClassOf(current);
        }

        return undefined;
    }

    private fail (message: string, node: ASTNode<T, N>): never {
        throw new ChordError({ phase: ErrorLevel.Analysis, message, location: node.location }).format();
    }
}
