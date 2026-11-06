import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { SymbolKind } from "../../../chord/model/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, CommandNode, EventNode, StartBotNode } from "../../types";

/**
 * Pass 2 of the Analyzer's binding model ("Variables"), dischord's own declarations: walks the
 * complete AST and registers `comando`/`evento`/`encender bot` into the `SymbolTable`, the same
 * way `BindDeclarationsRule` does for chord's own declaration types. Not to be mistaken for
 * `DisChordBindDeclarationsRule`, which replaces chord's rule to declare what a command and an
 * event put in scope.
 */
export class BindDisChordDeclarationsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, current => {
            if (current.type === DisChordTokenType.EVENTO) this.declare((current as EventNode).name, current);
            if (current.type === DisChordTokenType.CREAR_COMANDO) this.declare((current as CommandNode).value, current);
            if (current.type === DisChordTokenType.ENCENDER_BOT) this.declareBot(current as StartBotNode);
        });
    }

    /**
     * @param {string} name - The name a command or an event declares.
     * @param {DisChordASTNode} node - The declaring node.
     * @private
     */
    private declare (name: string, node: DisChordASTNode): void {
        this.context.symbolTable.register(name, { name, kind: SymbolKind.Declaration }, node.location);
    }

    /**
     * Declares `encender bot` under the reserved name `@bot`, which only one may hold per file.
     * @param {StartBotNode} node - The `encender bot` declaration.
     * @private
     */
    private declareBot (node: StartBotNode): void {
        try {
            this.declare('@bot', node);
        } catch {
            this.failAt(node, `Ya existe una declaración 'encender bot' en este archivo. Solo se permite una por archivo.`);
        }
    }
}
