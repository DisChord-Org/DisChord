import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { walkAST } from "../../../chord/Analyzer/walkAST";
import { buildSharedModuleImportSpecifier } from "../../../chord/Analyzer/sharedModulePath";
import { ImportNode, TokenType } from "../../../chord/types";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";
import { createMessageModuleContent, createMessageModulePath } from "../../core.lib";

/**
 * Detects, over the *complete* AST (any nesting depth — inside a `comando`/`evento`'s body, etc.),
 * whether the file declares a `nuevo mensaje {}`. If so, inserts a real, synthetic `ImportNode`
 * for the shared `createMessage` helper at the front of `nodes` — the same "lowering" step
 * `RequiresConsoleRuntimeRule` already does for chord's own console runtime — so `MessageVisitor`
 * (which emits the `createMessage(...)` call) never has to also decide whether to import it.
 */
export class RequiresMessageHelperRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): Map<string, string> {
        let needsMessageHelper = false;

        nodes.forEach(node => walkAST<DisChordNodeType, DisChordNode>(node, current => {
            if (current.type === DisChordTokenType.CREAR_MENSAJE) needsMessageHelper = true;
        }));

        if (!needsMessageHelper) return new Map();

        const importNode: ImportNode<DisChordNodeType> = {
            type: TokenType.Importar,
            identificators: [ 'createMessage' ],
            isDestructured: true,
            path: buildSharedModuleImportSpecifier(this.context, createMessageModulePath),
            location: { line: 0, column: 0 }
        };

        nodes.unshift(importNode);

        return new Map([[ createMessageModulePath, createMessageModuleContent ]]);
    }
}
