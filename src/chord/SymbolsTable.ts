import { Location, Symbol, SymbolKind, CompilerMetadataKind, TokenType } from "./types";
import { DataType } from "./DataType";
import { ChordError, ErrorLevel } from "../errors/ChordError";

/**
 * One lexical scope: the symbols declared in it plus its contextual compilation metadata.
 */
interface Scope {
    symbols: Map<string, Symbol>;
    metadata: Map<CompilerMetadataKind, unknown>;
}

/**
 * Manages the hierarchical symbol table for the DisChord language.
 * 
 * This class handles lexical scoping (scopes) using a stack of maps. 
 * It allows for symbol registration, lookups across scope boundaries, 
 * and prevents duplicate declarations within the same scope.
 */
export class SymbolTable {
    /**
     * A stack of scopes. The first element is the global scope, and the last is the current
     * local scope.
     */
    private scopes: Scope[] = [ SymbolTable.createScope() ];

    /**
     * Scopes bound to the AST node that owns them (a class, a function, a command...), so every
     * pass and the generator reopening the same node land on the same symbols.
     */
    private readonly nodeScopes: WeakMap<object, Scope> = new WeakMap();

    /**
     * Node types that own a scope for their body. Chord's own are classes and functions; a
     * dialect adds its own through {@link registerScopeOwner}.
     */
    private readonly scopeOwnerTypes: Set<string> = new Set([ TokenType.Clase, TokenType.Funcion ]);

    private static createScope(): Scope {
        return { symbols: new Map(), metadata: new Map() };
    }

    /**
     * Declares that nodes of `type` own a scope for their body.
     *
     * @param {string} type - The node type string.
     */
    public registerScopeOwner(type: string): void {
        this.scopeOwnerTypes.add(type);
    }

    /**
     * Whether `node` owns a scope for its body, i.e. whether the passes walking the tree must
     * {@link enterScope} it.
     *
     * @param {{ type: string }} node - The AST node to check.
     * @returns {boolean}
     */
    public ownsScope(node: { type: string }): boolean {
        return this.scopeOwnerTypes.has(node.type);
    }

    /**
     * Enters the scope owned by `node`, creating it the first time the node is seen. The scope
     * outlives {@link exitScope}, so later passes reopening the node find what earlier ones
     * registered in it.
     *
     * @param {object} node - The AST node owning the scope.
     */
    public enterScope(node: object): void {
        let scope = this.nodeScopes.get(node);

        if (!scope) {
            scope = SymbolTable.createScope();
            this.nodeScopes.set(node, scope);
        }

        this.scopes.push(scope);
    }

    /**
     * Exits the current local scope and returns to the parent scope, without destroying it.
     * Prevents popping the global scope.
     */
    public exitScope(): void {
        if (this.scopes.length > 1) this.scopes.pop();
    }

    /**
     * Registers a new symbol in the current scope.
     *
     * @param {string} name - The identifier name of the symbol.
     * @param {Partial<Symbol>} info - Metadata, kind (Function, Variable, etc.) and, if already
     * known at registration time, `dataType` of the symbol. Most callers register variables
     * before their type can be resolved and leave this `undefined`, filling it in later via
     * {@link setDataType} once the "Tipos" analysis pass runs.
     * @param {Location} location - Source code coordinates for error reporting.
     * @throws {ChordError} If the identifier is already declared in the current scope.
     */
    public register(name: string, info: Partial<Symbol>, location: Location): void {
        const currentScope = this.scopes[this.scopes.length - 1].symbols;
        
        if (currentScope.has(name)) {
            throw new ChordError({
                phase: ErrorLevel.Analysis,
                message: `Identificador duplicado: '${name}' ya ha sido declarado en este ámbito.`,
                location
            }).format();
        }

        currentScope.set(name, {
            name,
            kind: info.kind || SymbolKind.Variable,
            metadata: {
                isAsync: info.metadata?.isAsync || false,
                isExported: info.metadata?.isExported || false,
                isStatic: info.metadata?.isStatic || false
            },
            dataType: info.dataType
        });
    }

    /**
     * Assigns the resolved `dataType` to an already registered symbol, searching bottom-up from
     * the current scope to the global scope just like
     * {@link lookup}. Used by later analysis passes (e.g. the "Tipos" pass) that need the symbol
     * table fully populated by {@link register} before they can infer or validate a variable's
     * type — mutating the stored `Symbol` in place rather than re-registering it, since
     * `register` would reject the name as a duplicate.
     *
     * @param {string} name - The identifier name of the already registered symbol.
     * @param {DataType | undefined} dataType - The resolved type, or `undefined` if none
     * could be determined.
     * @returns {void} Silently does nothing if no symbol with that name is currently in scope.
     */
    public setDataType(name: string, dataType: DataType | undefined): void {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            const symbol = this.scopes[i].symbols.get(name);

            if (symbol) {
                symbol.dataType = dataType;
                return;
            }
        }
    }

    /**
     * Searches for a symbol by its identifier name.
     * Performs a bottom-up search starting from the current scope up to the global scope.
     * 
     * @param {string} name - The identifier name to find.
     * @returns {Symbol | undefined} The symbol if found, otherwise undefined.
     */
    public lookup(name: string): Symbol | undefined {
        for (let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].symbols.has(name)) {
                return this.scopes[i].symbols.get(name);
            }
        }
        return undefined;
    }

    /**
     * Sets a compiler metadata value in the current active scope.
     * 
     * @template T
     * @param {CompilerMetadataKind} key - The compiler metadata key enum identifier.
     * @param {unknown} value - The value payload associated with the metadata key.
     */
    public setMetadata(key: CompilerMetadataKind, value: unknown): void {
        this.scopes[this.scopes.length - 1].metadata.set(key, value);
    }

    /**
     * Retrieves a compiler metadata value by searching bottom-up from the current active scope to the global scope.
     * 
     * @template T
     * @param {CompilerMetadataKind} key - The compiler metadata key enum identifier to look up.
     * @returns {T | undefined} The metadata value cast to generic type T if found, otherwise undefined.
     */
    public getMetadata<T>(key: CompilerMetadataKind): T | undefined {
        for(let i = this.scopes.length - 1; i >= 0; i--) {
            if (this.scopes[i].metadata.has(key)) return this.scopes[i].metadata.get(key) as T;
        }

        return undefined;
    }
}