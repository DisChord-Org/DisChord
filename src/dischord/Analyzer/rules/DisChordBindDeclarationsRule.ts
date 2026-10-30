import { BindDeclarationsRule } from "../../../chord/Analyzer/rules/BindDeclarationsRule";
import { DataType } from "../../../chord/model/DataType";
import { InjectedNames } from "../../InjectedNames";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";

/**
 * Chord's `BindDeclarationsRule` plus the variables dischord puts in the scope of a command or an event
 * (see `InjectedNames`): the handler's parameter, `usuario`, the parameters of the event, the options of
 * the command. They are symbols of the scope like any `var`, so a reference to one resolves through the
 * symbol table and carries its type. `cliente` and `canal` are not registered: they are classes of the
 * core library (static, injected), and a variable of the same name would stop their members from being
 * rewritten. A name that appears twice (an option named like the handler's parameter, which `ValidateCommandRule`
 * rejects) is registered once, so that rule's message is the one reported.
 */
export class DisChordBindDeclarationsRule extends BindDeclarationsRule<DisChordNodeType, DisChordNode> {
    /**
     * @override
     */
    protected override scopeSymbols (owner: DisChordASTNode): { name: string; dataType?: DataType }[] {
        if (owner.type !== DisChordTokenType.CREAR_COMANDO && owner.type !== DisChordTokenType.EVENTO) return [];

        const seen = new Set<string>();

        return InjectedNames.of(owner).filter(({ name, hidden }) => {
            if (hidden || seen.has(name) || this.context.coreLib.isClassName(name)) return false;

            seen.add(name);
            return true;
        });
    }
}
