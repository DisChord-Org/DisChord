import { Location, Symbol, SymbolKind, CompilerMetadataKind } from "./types";
import { ChordError, ErrorLevel } from "../ChordError";

/**
 * Manages the hierarchical symbol table for the DisChord language.
 * 
 * This class handles lexical scoping (scopes) using a stack of maps. 
 * It allows for symbol registration, lookups across scope boundaries, 
 * and prevents duplicate declarations within the same scope.
 */
export class SymbolTable {
    /**
     * A stack of symbol maps representing nested scopes. 
     * The first element is the global scope, and the last is the current local scope.
     */
    private scopes: Map<string, Symbol>[] = [ new Map() ];

    /**
     * A stack of metadata maps matching the scope hierarchy, 
     * storing contextual compilation flags and metadata per scope.
     * 
     * @private
     */
    private metadata: Map<CompilerMetadataKind, unknown>[] = [ new Map() ];

    /**
     * Creates and enters a new lexical scope (e.g., when entering a block, function, or class).
     */
    public pushScope(): void {
        this.scopes.push(new Map());
        this.metadata.push(new Map());
    }

    /**
     * Exits the current local scope and returns to the parent scope.
     * Prevents popping the global scope.
     */
    public popScope(): void {
        if (this.scopes.length > 1) {
            this.scopes.pop();
            this.metadata.pop();
        }
    }

    /**
     * Registers a new symbol in the current scope.
     * 
     * @param {string} name - The identifier name of the symbol.
     * @param {Partial<Symbol>} info - Metadata and kind (Function, Variable, etc.) of the symbol.
     * @param {Location} location - Source code coordinates for error reporting.
     * @throws {ChordError} If the identifier is already declared in the current scope.
     */
    public register(name: string, info: Partial<Symbol>, location: Location): void {
        const currentScope = this.scopes[this.scopes.length - 1];
        
        if (currentScope.has(name)) {
            throw new ChordError({
                phase: ErrorLevel.Parser,
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
            }
        });
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
            if (this.scopes[i].has(name)) {
                return this.scopes[i].get(name);
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
        this.metadata[this.metadata.length - 1].set(key, value);
    }

    /**
     * Retrieves a compiler metadata value by searching bottom-up from the current active scope to the global scope.
     * 
     * @template T
     * @param {CompilerMetadataKind} key - The compiler metadata key enum identifier to look up.
     * @returns {T | undefined} The metadata value cast to generic type T if found, otherwise undefined.
     */
    public getMetadata<T>(key: CompilerMetadataKind): T | undefined {
        for(let i = this.metadata.length - 1; i >= 0; i--) {
            if (this.metadata[i].has(key)) return this.metadata[i].get(key) as T;
        }

        return undefined;
    }
}