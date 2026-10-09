import { AnalysisRule } from "../AnalysisRule";
import { walkAST } from "../../walkAST";
import { ASTNode, BaseNode, ClassNode, FunctionNode, ImportNode, LoopNode, TokenType, VariableNode } from "../../types";
import { ChordError, ErrorLevel } from "../../../errors/ChordError";

/**
 * Rejects declaring a name that belongs to a class of the core library (`Mapa`, `Mates`,
 * `consola`...): as a class, a variable, a free function, a parameter, an imported name or the
 * variable of a loop. A member of a class (a method or property) may carry such a name, and so may
 * a function named like a free function of the library (`esperar`), which wins over it.
 *
 * The names the compiler puts in scope itself (`cliente`, `canal`, see `CoreLibClass.injected`)
 * may be a parameter, since the callbacks it calls receive them, but not be declared otherwise.
 *
 * Runs first, so the error is this one and not a duplicate-declaration one.
 */
export class ValidateDeclarationNamesRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        nodes.forEach(node => walkAST<T, N>(node, current => this.validate(current)));
    }

    private validate (node: ASTNode<T, N>): void {
        switch (node.type) {
            case TokenType.Clase:
                this.reject((node as ClassNode<T, N>).id, 'la clase', node, false);
                break;

            case TokenType.Funcion: {
                const fn = node as FunctionNode<T, N>;
                if (!fn.metadata.isMethod && !fn.metadata.isConstructor) this.reject(fn.id, 'la función', node, false);
                fn.params.forEach(param => this.reject(param, 'el parámetro', node, true));
                break;
            }

            case TokenType.VARIABLE:
                this.reject((node as VariableNode<T, N>).id, 'la variable', node, false);
                break;

            case TokenType.BUCLE:
                this.reject((node as LoopNode<T, N>).var, 'la variable del bucle', node, false);
                break;

            case TokenType.Importar:
                (node as ImportNode<T>).identificators.forEach(name => this.reject(name, 'el nombre importado', node, false));
                break;
        }
    }

    /**
     * @param {string} name - A name being declared.
     * @param {string} what - What it declares, for the message.
     * @param {ASTNode<T, N>} node - The declaring node.
     * @param {boolean} isParameter - Whether it is a parameter, the one place an injected name is allowed.
     * @throws {ChordError} If the name is one of a class of the core library.
     * @private
     */
    private reject (name: string, what: string, node: ASTNode<T, N>, isParameter: boolean): void {
        const coreLib = this.context.coreLib;
        if (!coreLib.isClassName(name)) return;

        if (coreLib.isInjectedName(name)) {
            if (isParameter) return;

            this.fail(`No se puede declarar ${what} '${name}': es un identificador reservado por DisChord`, node);
        }

        this.fail(`No se puede declarar ${what} '${name}': es el nombre de una clase de la biblioteca estándar`, node);
    }

    private fail (message: string, node: ASTNode<T, N>): never {
        throw new ChordError({ phase: ErrorLevel.Analysis, message, location: node.location }).format();
    }
}
