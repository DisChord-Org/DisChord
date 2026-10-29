import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { SymbolKind } from "../../../chord/model/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType, CommandNode, EventNode, StartBotNode } from "../../types";

/**
 * Pass 2 of the Analyzer's binding model ("Variables"), dischord's own declarations: walks the
 * complete AST and registers `comando`/`evento`/`encender bot` into the `SymbolTable`, the same
 * way `BindDeclarationsRule` does for chord's own declaration types — moved here from
 * `EventParser`/`CommandParser`/`ClientParser`, which used to register these at parse time.
 */
export class BindDisChordDeclarationsRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        this.walk(nodes, current => {
            if (current.type === DisChordTokenType.EVENTO) {
                const eventNode = current as EventNode;
                this.context.symbolTable.register(eventNode.name, { name: eventNode.name, kind: SymbolKind.Declaration }, current.location);
            } else if (current.type === DisChordTokenType.CREAR_COMANDO) {
                const commandNode = current as CommandNode;
                this.context.symbolTable.register(commandNode.value, { name: commandNode.value, kind: SymbolKind.Declaration }, current.location);
            } else if (current.type === DisChordTokenType.ENCENDER_BOT) {
                const startBotNode = current as StartBotNode;

                try {
                    this.context.symbolTable.register('@bot', { name: '@bot', kind: SymbolKind.Declaration }, current.location);
                } catch {
                    this.failAt(startBotNode, `Ya existe una declaración 'encender bot' en este archivo. Solo se permite una por archivo.`);
                }
            }
        });
    }
}
