import { Analyzer } from "../../chord/Analyzer/Analyzer";
import { AnalysisRule } from "../../chord/Analyzer/AnalysisRule";
import { DisChordNode, DisChordNodeType } from "../types";
import { SingleWholeFileDeclarationRule } from "./rules/SingleWholeFileDeclarationRule";

/**
 * DisChord's semantic analysis rules, run over a file's complete AST between parsing and
 * generation. See `Analyzer` for the general phase contract — this subclass only registers which
 * `AnalysisRule`s apply; the actual checks live in `./rules`.
 */
export class DisChordAnalyzer extends Analyzer<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    protected rules: AnalysisRule<DisChordNodeType, DisChordNode>[] = [
        new SingleWholeFileDeclarationRule(this.context)
    ];
}
