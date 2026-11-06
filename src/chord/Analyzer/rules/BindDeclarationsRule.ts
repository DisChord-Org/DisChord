import { AnalysisRule } from "../AnalysisRule";
import { isClassNode, isFunctionNode, isPropertyNode, isVariableNode } from "../../ast.guards";
import { ASTNode, BaseNode, ClassNode, CompilerMetadataKind, FunctionNode, Location, LoopNode, SymbolKind, TokenType } from "../../model/types";
import { DataType } from "../../model/DataType";

/**
 * Pass 2 of the Analyzer's binding model ("Variables"): walks the complete AST and registers
 * every chord-level declaration (classes, functions, variables, properties) into the
 * `SymbolTable`, regardless of where in the file it appears. Since this runs over the whole tree
 * before anything validates references against it, declarations are visible to each other
 * independently of source order.
 *
 * Classes and functions (and whatever else the dialect declares through `SymbolTable.registerScopeOwner`)
 * get their own lexical scope for their body, bound to their node and entered/exited by its own
 * `enter`/`exit` hooks. Later passes reopen the same scope through `enterScope(node)`, and this is the only
 * pass that registers symbols in them.
 */
export class BindDeclarationsRule<T extends string, N extends BaseNode<T>> extends AnalysisRule<T, N> {
    /**
     * @override
     */
    check (nodes: ASTNode<T, N>[]): void {
        this.walk(nodes, current => this.enter(current), current => this.exit(current));
    }

    /**
     * The variables the dialect puts in the scope of a node that owns one (the parameters of an event,
     * what a command receives...), registered as symbols when the scope is entered. Chord has none.
     * @param {ASTNode<T, N>} _owner - A node that owns a scope.
     * @returns {{ name: string; dataType?: DataType }[]} Each variable, with its type if it has one.
     * @protected
     */
    protected scopeSymbols (_owner: ASTNode<T, N>): { name: string; dataType?: DataType }[] {
        return [];
    }

    private enter (node: ASTNode<T, N>): void {
        const table = this.context.symbolTable;

        if (!isClassNode(node) && !isFunctionNode(node) && table.ownsScope(node)) {
            this.bindScopeOwner(node);
        }

        if (isClassNode(node)) this.bindClass(node);
        else if (isFunctionNode(node)) this.bindFunction(node);
        else if (node.type === TokenType.BUCLE) this.bindLoopVariable(node as LoopNode<T, N>);
        else if (isVariableNode(node)) this.declare(node.id, SymbolKind.Variable, node.location);
        else if (isPropertyNode(node)) this.declare(node.id, SymbolKind.Property, node.location);
    }

    /**
     * Registers a symbol with nothing but a name and a kind in the current scope.
     * @private
     */
    private declare (name: string, kind: SymbolKind, location: Location): void {
        this.context.symbolTable.register(name, { name, kind }, location);
    }

    /**
     * Enters the scope of a node that owns one, other than a class or a function (a loop, an event...),
     * and registers the variables the dialect puts in it.
     * @private
     */
    private bindScopeOwner (node: ASTNode<T, N>): void {
        const table = this.context.symbolTable;
        table.enterScope(node);

        this.scopeSymbols(node).forEach(({ name, dataType }) => {
            table.register(name, { name, kind: SymbolKind.Variable, dataType }, node.location);
        });
    }

    private bindClass (node: ClassNode<T, N>): void {
        const table = this.context.symbolTable;
        this.declare(node.id, SymbolKind.Class, node.location);

        table.enterScope(node);
        table.classes.register(node.id, table.currentMembers, node.superClass);
        table.setMetadata(CompilerMetadataKind.CurrentClass, node.id);
    }

    private bindFunction (node: FunctionNode<T, N>): void {
        const table = this.context.symbolTable;

        table.register(node.id, {
            name: node.id,
            kind: SymbolKind.Function,
            metadata: {
                isAsync: node.metadata.isAsync
            },
            signature: {
                params: node.params.map((_, index) => node.paramTypes?.[index]),
                returns: node.returnType,
                annotated: node.returnType !== undefined || !!node.paramTypes?.some(type => type !== undefined)
            }
        }, node.location);

        table.enterScope(node);

        node.params.forEach((param, index) => {
            table.register(param, {
                name: param,
                kind: SymbolKind.Variable,
                dataType: node.paramTypes?.[index]
            }, node.location);
        });
    }

    /**
     * The variable of a `para` is a symbol of the scope of the loop, which is already entered.
     * @private
     */
    private bindLoopVariable (node: LoopNode<T, N>): void {
        this.declare(node.var, SymbolKind.Variable, node.location);
    }

    private exit (node: ASTNode<T, N>): void {
        if (this.context.symbolTable.ownsScope(node)) {
            this.context.symbolTable.exitScope();
        }
    }
}
