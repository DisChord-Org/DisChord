import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { LoopNode, TokenType } from "../../../chord/model/types";
import { isFunctionNode, isVariableNode } from "../../../chord/ast.guards";
import { InjectedNames } from "../../InjectedNames";
import { CommandNode, DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, EventNode } from "../../types";

/**
 * Rejects declaring, inside a command or an event, a name the construct already defines for its body
 * (`usuario`, the parameters of the event, the options of the command): the generated code declares
 * those itself, and a second declaration of the same name in the same scope is a SyntaxError when it
 * runs. It covers a `var`, the parameters of a function declared inside, and the variable of a loop.
 * A function declared outside the construct is not affected. The names come from `InjectedNames`.
 *
 * An option named like an injected name is a different case, rejected by `ValidateCommandRule`.
 */
export class ValidateInjectedNamesRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * The commands and events being walked, innermost last, each with the names it defines.
     */
    private readonly owners: { kind: string; name: string; defined: readonly string[] }[] = [];

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, node => this.enter(node), node => {
            if (this.isOwner(node)) this.owners.pop();
        });
    }

    private isOwner (node: DisChordASTNode): boolean {
        return node.type === DisChordTokenType.CREAR_COMANDO || node.type === DisChordTokenType.EVENTO;
    }

    private ownerOf (node: DisChordASTNode): { kind: string; name: string; defined: readonly string[] } {
        const isCommand = node.type === DisChordTokenType.CREAR_COMANDO;

        return { kind: isCommand ? 'el comando' : 'el evento', name: isCommand ? (node as CommandNode).value : (node as EventNode).name, defined: InjectedNames.of(node) };
    }

    private enter (node: DisChordASTNode): void {
        if (this.isOwner(node)) this.owners.push(this.ownerOf(node));

        if (isVariableNode(node)) this.reject(node.id, node);
        if (node.type === TokenType.BUCLE) this.reject((node as LoopNode<DisChordNodeType, DisChordNode>).var, node);
        if (isFunctionNode(node)) node.params.forEach(param => this.reject(param, node));
    }

    /**
     * @param {string} name - A name being declared.
     * @param {DisChordASTNode} node - The declaring node.
     * @throws {DisChordError} If the command or event the declaration is in already defines the name.
     * @private
     */
    private reject (name: string, node: DisChordASTNode): void {
        const owner = this.owners[this.owners.length - 1];

        if (owner?.defined.includes(name)) this.failAt(node, `No se puede declarar '${name}': ${owner.kind} '${owner.name}' ya lo define.`);
    }
}
