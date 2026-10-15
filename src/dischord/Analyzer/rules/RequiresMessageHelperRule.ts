import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/walkAST";
import { SharedModuleImporter } from "../../../chord/Analyzer/SharedModuleImporter";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { createMessageModule } from "../../corelib";

/**
 * Detects, over the *complete* AST (any nesting depth — inside a `comando`/`evento`'s body, etc.),
 * whether the file declares an `enviar mensaje {}`. If so, inserts a real, synthetic `ImportNode`
 * for the shared `createMessage` helper at the front of `nodes` — the same "lowering" step
 * `RequiresConsoleRuntimeRule` already does for chord's own console runtime — so `MessageVisitor`
 * (which emits the `createMessage(...)` call) never has to also decide whether to import it.
 */
export class RequiresMessageHelperRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly sharedModules = new SharedModuleImporter(this.context);

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        let needsMessageHelper = false;

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.CREAR_MENSAJE) needsMessageHelper = true;
        }));

        if (!needsMessageHelper) return;

        this.sharedModules.insert(nodes, createMessageModule, [ 'createMessage' ]);
    }
}
