import { AnalysisRule } from "../../../chord/Analyzer/AnalysisRule";
import { SharedModuleImporter } from "../../../chord/Analyzer/SharedModuleImporter";
import { SharedModule } from "../../../chord/model/SharedModule";
import { Symbol, TokenType } from "../../../chord/model/types";
import { isAccessNode, isIdentificatorNode, isVariableNode } from "../../../chord/ast.guards";
import { DisChordASTNode, DisChordNode, DisChordNodeType, DisChordTokenType } from "../../types";

/**
 * Base of the rules that import a shared module patching Seyfert's classes with Spanish-named members
 * (`usuario.nombre`): it decides when a file needs that import and a subclass says which names the
 * module patches and which module it is.
 *
 * An access `x.<nombre>` counts when all of this holds:
 *  1. `nombre` is one of the patched names;
 *  2. the file has Discord context (a `comando`, an `evento` or an `encender bot`);
 *  3. the receiver is not resolved some other way: not `esta`, not an injected object (`cliente`,
 *     `canal`: the classes of the core library marked as injected), and not a variable that holds the
 *     result of a channel action (`obtener canal`...), told by its symbol and not by its name.
 * Whatever its receiver, a file with `encender bot` always imports the module, since the patch is global
 * to the process. The patched object can be anything (a user, a member, a parameter of a function), so
 * there is no receiver to tell it by; an unused import is harmless (the patch is idempotent). Access by
 * index (`u["nombre"]`, `u[clave]`) is not detected.
 *
 * A subclass can add a trigger of its own through {@link triggers}, which needs no access nor Discord context.
 */
export abstract class RequiresPatchedMembersRule extends AnalysisRule<DisChordNodeType, DisChordNode> {
    private readonly sharedModules = new SharedModuleImporter(this.context);

    /**
     * The names the module patches onto Seyfert's classes.
     * @protected
     */
    protected abstract readonly patchedNames: Readonly<Record<string, string>>;

    /**
     * The module that does the patching.
     * @protected
     */
    protected abstract readonly module: SharedModule;

    /**
     * A trigger of the subclass besides the patched names: whether a node alone makes the file need the module.
     * @param {DisChordASTNode} node - Any node of the tree.
     * @returns {boolean}
     * @protected
     */
    protected triggers (node: DisChordASTNode): boolean {
        return false;
    }

    /**
     * @override
     */
    check (nodes: DisChordASTNode[]): void {
        if (this.needsModule(nodes)) this.sharedModules.insert(nodes, this.module);
    }

    private needsModule (nodes: DisChordASTNode[]): boolean {
        let hasDiscordContext = false;
        let always = false;
        let accessed = false;

        // symbols of the variables that hold the result of a channel action
        const channelResults: Set<Symbol> = new Set();

        this.walkScoped(nodes, node => {
            if (always) return;

            if (node.type === DisChordTokenType.CREAR_COMANDO || node.type === DisChordTokenType.EVENTO) hasDiscordContext = true;
            if (node.type === DisChordTokenType.ENCENDER_BOT || this.triggers(node)) always = true;

            if (isVariableNode(node) && node.value.type === DisChordTokenType.ACCION_CANAL) {
                const symbol = this.context.symbolTable.lookup(node.id);
                if (symbol) channelResults.add(symbol);
            }

            if (isAccessNode(node) && Object.prototype.hasOwnProperty.call(this.patchedNames, node.property) && !this.isResolvedElsewhere(node.object, channelResults)) {
                accessed = true;
            }
        });

        return always || (hasDiscordContext && accessed);
    }

    /**
     * Whether the receiver of an access is something the compiler resolves some other way.
     * @private
     */
    private isResolvedElsewhere (receiver: DisChordASTNode, channelResults: Set<Symbol>): boolean {
        if (receiver.type === TokenType.Esta) return true;
        if (!isIdentificatorNode(receiver)) return false;

        const symbol = this.context.symbolTable.lookup(receiver.value);
        if (symbol) return channelResults.has(symbol);

        return this.context.coreLib.isInjectedName(receiver.value);
    }
}
