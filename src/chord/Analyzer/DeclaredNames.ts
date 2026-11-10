import { ASTNode, BaseNode, ClassNode, FunctionNode, ImportNode, LoopNode, TokenType, VariableNode } from "../model/types";
import { SharedModuleImporter } from "./SharedModuleImporter";

/**
 * A name a node declares.
 * @property {string} name - The name.
 * @property {string} description - What it declares, to say in a message ("la variable").
 * @property {boolean} isParameter - Whether it is a parameter of a function.
 * @property {boolean} isFileLevel - Whether it lives in the scope of the file when the node does (everything but a parameter and the variable of a loop).
 */
export interface DeclaredName {
    name: string;
    description: string;
    isParameter: boolean;
    isFileLevel: boolean;
}

/**
 * The names a node declares: the one place the analyzer rules that look at declarations read from.
 * A method or a constructor declares no name of the scope (it is a member of its class), and the
 * import the compiler inserts itself declares none that is the user's.
 * @class DeclaredNames
 */
export class DeclaredNames {
    /**
     * @param {ASTNode<T, N>} node - Any node.
     * @returns {DeclaredName[]} The names it declares; none if it declares none.
     */
    public static of<T extends string, N extends BaseNode<T>> (node: ASTNode<T, N>): DeclaredName[] {
        const named = (name: string, description: string, isFileLevel = true): DeclaredName => ({ name, description, isParameter: false, isFileLevel });

        switch (node.type) {
            case TokenType.Clase:
                return [ named((node as ClassNode<T, N>).id, 'la clase') ];

            case TokenType.Funcion: {
                const fn = node as FunctionNode<T, N>;
                const own = !fn.metadata.isMethod && !fn.metadata.isConstructor ? [ named(fn.id, 'la función') ] : [];

                return [ ...own, ...fn.params.map(param => ({ name: param, description: 'el parámetro', isParameter: true, isFileLevel: false })) ];
            }

            case TokenType.VARIABLE:
                return [ named((node as VariableNode<T, N>).id, 'la variable') ];

            case TokenType.BUCLE:
                return [ named((node as LoopNode<T, N>).var, 'la variable del bucle', false) ];

            case TokenType.Importar:
                return SharedModuleImporter.isSynthetic(node) ? [] : (node as ImportNode<T>).identificators.map(name => named(name, 'el nombre importado'));

            default:
                return [];
        }
    }
}
